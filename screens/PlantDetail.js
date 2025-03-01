import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {
  getPlantById,
  getPlantsInFieldDet,
  getPlantsInGreenhouseDet,
  getPlantCalendar,
  insertPlantCalendarEntry,
} from '../database';
import AddButt from '../components/AddButt';

const PlantDetail = ({ route }) => {
  const { plantId } = route.params;
  const [plant, setPlant] = useState(null);
  const [fields, setFields] = useState([]);
  const [greenhouses, setGreenhouses] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: '',
    photo: '',
    harvestAmount: '',
    notes: '',
  });

  useEffect(() => {
    loadPlantData();
  }, []);

  const loadPlantData = async () => {
    const plantData = await getPlantById(plantId);
    const fieldData = await getPlantsInFieldDet(plantId);
    const greenhouseData = await getPlantsInGreenhouseDet(plantId);
    const calendarData = await getPlantCalendar(plantId);
    setPlant(plantData);
    setFields(fieldData);
    setGreenhouses(greenhouseData);
    setCalendar(calendarData);
  };

  const handleSaveEntry = async () => {
    if (!newEntry.date.trim()) {
      Alert.alert('Chyba', 'Datum je povinné!');
      return;
    }
    await insertPlantCalendarEntry(
      plantId,
      newEntry.date,
      newEntry.photo,
      newEntry.harvestAmount,
      newEntry.notes
    );
    setIsFormVisible(false);
    setNewEntry({ date: '', photo: '', harvestAmount: '', notes: '' });
    loadPlantData();
  };

  const safeGetFieldData = (field) => ({
    name: field.field_name || 'Neznámý záhon',
    year: field.year || 'Neznámý rok',
  });
  
  const safeGetGreenhouseData = (greenhouse) => ({
    name: greenhouse.greenhouse_name || 'Neznámý skleník',
    year: greenhouse.year || 'Neznámý rok',
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {plant ? (
        <View style={styles.plantDetails}>
          <Text style={styles.title}>
            {plant.name || plant.greenhouse_name || 'Beze jména'}
          </Text>
        </View>
      ) : (
        <Text>Načítání dat...</Text>
      )}

      <Text style={styles.sectionTitle}>Záhony</Text>
      {fields.length > 0 ? (
        fields.map((field, index) => {
          const { name, year } = safeGetFieldData(field);
          return (
            <Text key={index}>
              {name} ({year})
            </Text>
          );
        })
      ) : (
        <Text>Žádné pole nenalezeno</Text>
      )}

      <Text style={styles.sectionTitle}>Skleníky</Text>
      {greenhouses.length > 0 ? (
        greenhouses.map((greenhouse, index) => {
          const { name, year } = safeGetGreenhouseData(greenhouse);
          return (
            <Text key={index}>
              {name} ({year})
            </Text>
          );
        })
      ) : (
        <Text>Žádný skleník nenalezen</Text>
      )}

      <Text style={styles.sectionTitle}>Kalendář záznamů</Text>
      {calendar.length > 0 ? (
        calendar.map((entry, index) => (
          <View key={index} style={styles.entry}>
            <Text>
              {entry.date} - {entry.notes || 'Bez poznámek'}
            </Text>
            {entry.photo ? (
              <Image source={{ uri: entry.photo }} style={styles.entryImage} />
            ) : null}
          </View>
        ))
      ) : (
        <Text>Žádné záznamy</Text>
      )}

      <AddButt title="Přidat záznam" onPress={() => setIsFormVisible(true)} />

      <Modal visible={isFormVisible} transparent={true} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text>Datum</Text>
            <TextInput
              style={styles.input}
              value={newEntry.date}
              onChangeText={(text) =>
                setNewEntry({ ...newEntry, date: text })
              }
            />
            <Text>Foto (URL)</Text>
            <TextInput
              style={styles.input}
              value={newEntry.photo}
              onChangeText={(text) =>
                setNewEntry({ ...newEntry, photo: text })
              }
            />
            <Text>Úroda</Text>
            <TextInput
              style={styles.input}
              value={newEntry.harvestAmount}
              onChangeText={(text) =>
                setNewEntry({ ...newEntry, harvestAmount: text })
              }
            />
            <Text>Poznámky</Text>
            <TextInput
              style={styles.input}
              value={newEntry.notes}
              onChangeText={(text) =>
                setNewEntry({ ...newEntry, notes: text })
              }
            />
            <AddButt title="Uložit" onPress={handleSaveEntry} />
            <AddButt title="Zavřít" onPress={() => setIsFormVisible(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 10 
   },
  debugInfo: { 
    fontSize: 12, 
    color: 'gray', 
    marginBottom: 10 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginTop: 20 
  },
  entry: { 
    marginVertical: 10 
  },
  entryImage: { 
    width: 100, 
    height: 100, 
    marginTop: 5 
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  input: { 
    borderBottomWidth: 1, 
    marginBottom: 10, 
    padding: 5 
  },
});

export default PlantDetail;
