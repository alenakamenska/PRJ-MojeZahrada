import * as SQLite from 'expo-sqlite';

// Otevření databáze
export const openDatabase = async () => {
  const db = await SQLite.openDatabaseAsync('gardening1.db');
  await db.execAsync('PRAGMA foreign_keys = ON;');
  return db;
};

/****************** VYTVOŘENÍ TABULEK ******************/

export const createTables = async () => {
  const db = await openDatabase();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS plants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      seed_id INTEGER,
      FOREIGN KEY (seed_id) REFERENCES seeds(id) ON DELETE SET NULL
    );
  `);
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
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS fields (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT,
      soil_type TEXT,
      photo TEXT
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS greenhouses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT,
      photo TEXT
    );
  `);


  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS field_plants (
      field_id INTEGER,
      plant_id INTEGER,
      year INTEGER,
      count INTEGER,
      FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
      FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS greenhouse_plants (
      greenhouse_id INTEGER,
      plant_id INTEGER,
      year INTEGER,
      count INTEGER,
      FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
      FOREIGN KEY (greenhouse_id) REFERENCES greenhouses(id) ON DELETE CASCADE
    );
  `);
  

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS plant_calendar (
      plant_id INTEGER,
      date TEXT,
      photo TEXT,
      harvest_amount REAL,
      notes TEXT,
      FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
    );
  `);
};

/****************** CRUD OPERACE ******************/

export const insertPlant = async (name, seedId = null) => {
  const db = await openDatabase();
  return await db.runAsync('INSERT INTO plants (name, seed_id) VALUES (?, ?)', name, seedId);
};

export const getAllPlants = async () => {
  const db = await openDatabase();
  return await db.getAllAsync('SELECT * FROM plants');
};

export const getPlantById = async (id) => {
  const db = await openDatabase();
  return await db.getFirstAsync('SELECT * FROM plants WHERE id = ?', id);
};

export const updatePlant = async (id, name, seedId) => {
  const db = await openDatabase();
  return await db.runAsync('UPDATE plants SET name = ?, seed_id = ? WHERE id = ?', name, seedId, id);
};

export const deletePlant = async (id) => {
  const db = await openDatabase();
  return await db.runAsync('DELETE FROM plants WHERE id = ?', id);
};

export const insertSeed = async (purchaseDate, purchasePlace, price, photo, quantity, isOutOfStock) => {
  const db = await openDatabase();
  return await db.runAsync(
    'INSERT INTO seeds (purchase_date, purchase_place, price, photo, quantity, is_out_of_stock) VALUES (?, ?, ?, ?, ?, ?)',
    purchaseDate, purchasePlace, price, photo, quantity, isOutOfStock ? 1 : 0
  );
};

export const getAllSeeds = async () => {
  const db = await openDatabase();
  return await db.getAllAsync('SELECT * FROM seeds');
};

export const updateSeed = async (id, purchaseDate, purchasePlace, price, photo, quantity, isOutOfStock) => {
  const db = await openDatabase();
  return await db.runAsync(
    'UPDATE seeds SET purchase_date = ?, purchase_place = ?, price = ?, photo = ?, quantity = ?, is_out_of_stock = ? WHERE id = ?',
    purchaseDate, purchasePlace, price, photo, quantity, isOutOfStock ? 1 : 0, id
  );
};

export const deleteSeed = async (id) => {
  const db = await openDatabase();
  return await db.runAsync('DELETE FROM seeds WHERE id = ?', id);
};

export const insertField = async (name, location, soilType, photo) => {
  const db = await openDatabase();
  return await db.runAsync('INSERT INTO fields (name, location, soil_type, photo) VALUES (?, ?, ?, ?)', name, location, soilType, photo);
};

export const getAllFields = async () => {
  const db = await openDatabase();
  return await db.getAllAsync('SELECT * FROM fields');
};

export const updateField = async (id, name, location, soilType, photo) => {
  const db = await openDatabase();
  return await db.runAsync(
    'UPDATE fields SET name = ?, location = ?, soil_type = ?, photo = ? WHERE id = ?',
    name, location, soilType, photo, id
  );
};

export const deleteField = async (id) => {
  const db = await openDatabase();

  try {
    await db.runAsync('DELETE FROM field_plants WHERE field_id = ?', [id]);
    await db.runAsync('DELETE FROM fields WHERE id = ?', [id]);

    console.log(`Záhon s ID ${id} byl úspěšně smazán.`);
  } catch (error) {
    console.error("Chyba při mazání záhonu:", error);
  }
};


export const insertGreenhouse = async (name, location, photo) => {
  const db = await openDatabase();
  return await db.runAsync('INSERT INTO greenhouses (name, location, photo) VALUES (?, ?, ?)', name, location, photo);
};

export const getAllGreenhouses = async () => {
  const db = await openDatabase();
  return await db.getAllAsync('SELECT * FROM greenhouses');
};

export const updateGreenhouse = async (id, name, location, photo) => {
  const db = await openDatabase();
  return await db.runAsync(
    'UPDATE greenhouses SET name = ?, location = ?, photo = ? WHERE id = ?',
    name, location, photo, id
  );
};

export const deleteGreenhouse = async (id) => {
  const db = await openDatabase();
  return await db.runAsync('DELETE FROM greenhouses WHERE id = ?', id);
};

export const addPlantToField = async (plantId, fieldId, year, count) => {
  const db = await openDatabase();
  return await db.runAsync(
    'INSERT INTO field_plants (plant_id, field_id, year, count) VALUES (?, ?, ?, ?)',
    plantId, fieldId, year, count
  );
};

export const removePlantFromField = async (fieldId, plantId, year) => {
  const db = await openDatabase();
  return await db.runAsync('DELETE FROM field_plants WHERE field_id = ? AND plant_id = ? AND year = ?', fieldId, plantId, year);
};

export const addPlantToGreenhouse = async (plantId, greenhouseId, year, count) => {
  const db = await openDatabase();
  return await db.runAsync(
    'INSERT INTO greenhouse_plants (plant_id, greenhouse_id, year, count) VALUES (?, ?, ?, ?)',
    plantId, greenhouseId, year, count
  );
};

export const removePlantFromGreenhouse = async (greenhouseId, plantId, year) => {
  const db = await openDatabase();
  return await db.runAsync('DELETE FROM greenhouse_plants WHERE greenhouse_id = ? AND plant_id = ? AND year = ?', greenhouseId, plantId, year);
};


export const insertPlantCalendarEntry = async (plantId, date, photo, harvestAmount, notes) => {
  const db = await openDatabase();
  return await db.runAsync(
    'INSERT INTO plant_calendar (plant_id, date, photo, harvest_amount, notes) VALUES (?, ?, ?, ?, ?)',
    plantId, date, photo, harvestAmount, notes
  );
};

export const getPlantCalendar = async (plantId) => {
  const db = await openDatabase();
  return await db.getAllAsync('SELECT * FROM plant_calendar WHERE plant_id = ?', plantId);
};

export const getPlantsInField = async (fieldId) => {
  const db = await openDatabase();
  return await db.getAllAsync(`
    SELECT p.*, fp.year, fp.count
    FROM plants p
    JOIN field_plants fp ON p.id = fp.plant_id
    WHERE fp.field_id = ?
  `, fieldId);
};

export const getPlantsInGreenhouse = async (greenhouseId) => {
  const db = await openDatabase();
  return await db.getAllAsync(`
    SELECT p.*, gp.year, gp.count 
    FROM plants p
    JOIN greenhouse_plants gp ON p.id = gp.plant_id
    WHERE gp.greenhouse_id = ?
  `, greenhouseId);
};