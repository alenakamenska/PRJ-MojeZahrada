import * as SQLite from 'expo-sqlite';

export const openDatabase = async () => {
  const db = await SQLite.openDatabaseAsync('mydatabase1.db');
  return db;
};

export const createSklenikTable = async () => {
  const db = await openDatabase(); // Otevření databáze
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sklenik (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT
    );
  `);
  console.log("Tabulka 'sklenik' byla vytvořena.");
};

export const insertSklenik = async (name, location) => {
  const db = await openDatabase(); // Otevření databáze
  const result = await db.runAsync(
    'INSERT INTO sklenik (name, location) VALUES (?, ?)',
    name,
    location
  );
  console.log(`Nový skleník přidán s ID: ${result.lastInsertRowId}`);
  return result;
};

export const getAllGreenhouses = async () => {
  const db = await openDatabase(); // Otevření databáze
  const rows = await db.getAllAsync('SELECT * FROM sklenik');
  return rows;
};

export const getGreenhouseById = async (id) => {
  const db = await openDatabase(); // Otevření databáze
  const row = await db.getFirstAsync('SELECT * FROM sklenik WHERE id = ?', id);
  return row;
};

export const updateGreenhouse = async (id, name, location) => {
  const db = await openDatabase(); // Otevření databáze
  const result = await db.runAsync(
    'UPDATE sklenik SET name = ?, location = ? WHERE id = ?',
    name,
    location,
    id
  );
  console.log(`Skleník s ID ${id} byl aktualizován.`);
  return result;
};


export const deleteGreenhouse = async (id) => {
  const db = await openDatabase(); // Otevření databáze
  const result = await db.runAsync('DELETE FROM sklenik WHERE id = ?', id);
  console.log(`Skleník s ID ${id} byl smazán.`);
  return result;
};
export const createPlantTables = async () => {
    const db = await openDatabase(); 
  
    // Vytvoření tabulky plants, pokud neexistuje
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS plants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        year INTEGER,
        greenhouse_id INTEGER,
        FOREIGN KEY (greenhouse_id) REFERENCES sklenik(id) ON DELETE SET NULL
      );
    `);
  
    console.log("Tabulka 'plants' byla vytvořena nebo již existuje.");
  
    // Vytvoření tabulky plant_fields, pokud neexistuje
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS plant_fields (
        plant_id INTEGER,
        field_id INTEGER,
        PRIMARY KEY (plant_id, field_id),
        FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
        FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
      );
    `);
  
    console.log("Tabulka 'plant_fields' byla vytvořena nebo již existuje.");
  };
  
  
  export const insertPlant = async (name, year, greenhouseId = null) => {
    const db = await openDatabase();
    const result = await db.runAsync(
      'INSERT INTO plants (name, year, greenhouse_id) VALUES (?, ?, ?)',
      name,
      year || null, 
      greenhouseId
    );
    console.log(`Nová rostlina přidána s ID: ${result.lastInsertRowId}`);
    return result;
  };
  
  export const addPlantToField = async (plantId, fieldId) => {
    const db = await openDatabase();
    await db.runAsync(
      'INSERT INTO plant_fields (plant_id, field_id) VALUES (?, ?)',
      plantId,
      fieldId
    );
    console.log(`Rostlina ${plantId} byla přidána na pole ${fieldId}`);
  };

  export const getPlantbyId = async (greenhouseId) => { 
    const db = await openDatabase();  
    try {
      const rows = await db.getAllAsync(`
        SELECT p.id, p.name, p.year, g.name AS greenhouse
        FROM plants p
        LEFT JOIN sklenik g ON p.greenhouse_id = g.id
        WHERE p.greenhouse_id = ?;
      `, [greenhouseId]);  
  
      return rows;  
    } catch (error) {
      console.error("Chyba při načítání rostlin: ", error);
      throw error;  
    }
  };
  
  export const getAllPlants = async () => {
    const db = await openDatabase();
    const rows = await db.getAllAsync(`
      SELECT p.id, p.name, p.year, g.name AS greenhouse, 
      GROUP_CONCAT(f.name, ', ') AS fields
      FROM plants p
      LEFT JOIN sklenik g ON p.greenhouse_id = g.id
      LEFT JOIN plant_fields pf ON p.id = pf.plant_id
      LEFT JOIN fields f ON pf.field_id = f.id
      GROUP BY p.id;
    `);
    return rows;
  };
  
  export const updatePlant = async (id, name, year, greenhouseId) => {
    const db = await openDatabase();
    await db.runAsync(
      'UPDATE plants SET name = ?, year = ?, greenhouse_id = ? WHERE id = ?',
      name,
      year,
      greenhouseId,
      id
    );
    console.log(`Rostlina s ID ${id} byla aktualizována.`);
  };  
  
  export const deletePlant = async (id) => {
    const db = await openDatabase();
    await db.runAsync('DELETE FROM plants WHERE id = ?', id);
    console.log(`Rostlina s ID ${id} byla smazána.`);
  };

  export const createSeedsTable = async () => {
    const db = await openDatabase();
  
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS seeds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        purchase_date TEXT NOT NULL,
        purchase_place TEXT,
        price REAL,
        photo TEXT,
        quantity INTEGER,
        is_out_of_stock BOOLEAN DEFAULT 0
      );
    `);
  
    console.log("Tabulka 'seeds' byla vytvořena nebo již existuje.");
  };
  
  export const insertSeed = async (purchaseDate, purchasePlace, price, photo, quantity, isOutOfStock) => {
    const db = await openDatabase();
    const result = await db.runAsync(
      'INSERT INTO seeds (purchase_date, purchase_place, price, photo, quantity, is_out_of_stock) VALUES (?, ?, ?, ?, ?, ?)',
      purchaseDate,
      purchasePlace,
      price,
      photo,
      quantity,
      isOutOfStock ? 1 : 0
    );
    console.log(`Nové semínko přidáno s ID: ${result.lastInsertRowId}`);
    return result;
  };
  
  export const getAllSeeds = async () => {
    const db = await openDatabase();
    const rows = await db.getAllAsync('SELECT * FROM seeds');
    return rows;
  };
  
  export const getSeedById = async (id) => {
    const db = await openDatabase();
    const row = await db.getFirstAsync('SELECT * FROM seeds WHERE id = ?', id);
    return row;
  };
  
  export const updateSeed = async (id, purchaseDate, purchasePlace, price, photo, quantity, isOutOfStock) => {
    const db = await openDatabase();
    await db.runAsync(
      'UPDATE seeds SET purchase_date = ?, purchase_place = ?, price = ?, photo = ?, quantity = ?, is_out_of_stock = ? WHERE id = ?',
      purchaseDate,
      purchasePlace,
      price,
      photo,
      quantity,
      isOutOfStock ? 1 : 0,
      id
    );
    console.log(`Semínko s ID ${id} bylo aktualizováno.`);
  };
  
  export const deleteSeed = async (id) => {
    const db = await openDatabase();
    await db.runAsync('DELETE FROM seeds WHERE id = ?', id);
    console.log(`Semínko s ID ${id} bylo smazáno.`);
  };
