import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TextInput, Alert, Image, Dimensions } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import 'moment/locale/cs';
import * as ImagePicker from 'expo-image-picker';
import { getPlantById, getPlantsInFieldDet, getPlantsInGreenhouseDet, getPlantCalendar, insertPlantCalendarEntry } from '../database';
import AddButt from '../components/AddButt';
import PhotoButt from '../components/PhotoButt'

const { width, height } = Dimensions.get('window');

const PlantDetail = ({ route }) => {
  const { plantId } = route.params;
  const [plant, setPlant] = useState(null);
  const [fields, setFields] = useState([]);
  const [greenhouses, setGreenhouses] = useState([]);
  const [calendar, setCalendar] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [photo, setPhoto] = useState('');
  const [harvestAmount, setHarvestAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedNote, setSelectedNote] = useState(''); 
  const [selectedHarvest, setSelectedHarvest] = useState(''); 
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState('');


  LocaleConfig.locales['cs'] = {
    monthNames: [
      'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
      'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'
    ],
    monthNamesShort: [
      'Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čer',
      'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro'
    ],
    dayNames: [
      'Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'
    ],
    dayNamesShort: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'],
    today: 'Dnes'
  };
  LocaleConfig.defaultLocale = 'cs';

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
    markCalendarDates(calendarData);
  };

  const markCalendarDates = (entries) => {
    const marks = {};
    entries.forEach(entry => {
      marks[entry.date] = { marked: true, dotColor: 'green' };
    });
    setMarkedDates(marks);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Přístup odmítnut", "Aplikace potřebuje přístup k fotkám.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSaveEntry = async () => {
    if (!date.trim()) {
      Alert.alert('Chyba', 'Datum je povinné!');
      return;
    }
    await insertPlantCalendarEntry(plantId, date, photo, harvestAmount, notes);
    setIsFormVisible(false);
    setDate(moment().format('YYYY-MM-DD')); 
    setPhoto('');
    setHarvestAmount('');
    setNotes('');
    loadPlantData();  
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    setDate(moment(selectedDate).format('YYYY-MM-DD'));
    hideDatePicker();
  };

  const handleDayPress = (day) => {
    setDate(day.dateString);
    const selectedEntry = calendar.find(entry => entry.date === day.dateString);
    if (selectedEntry) {
      setSelectedNote(selectedEntry.notes);
      setSelectedPhoto(selectedEntry.photo); 
      setSelectedHarvest(selectedEntry.harvest_amount)
      console.log('Vybraný záznam:', selectedEntry);
    } else {
      setSelectedNote('');
      setSelectedPhoto(''); 
      setSelectedHarvest('') 
    }
  };

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

<View>
  <Text style={styles.sectionTitle}>📍 Záhony</Text>
  <View style={styles.listContainer}>
    {fields.length > 0 ? (
      fields.map((field, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{field.field_name}</Text>
          <Text style={styles.cardSubtitle}>{field.year}</Text>
        </View>
      ))
    ) : (
      <Text style={styles.emptyText}>Žádné pole nenalezeno</Text>
    )}
  </View>

  <Text style={styles.sectionTitle}>🏡 Skleníky</Text>
  <View style={styles.listContainer}>
    {greenhouses.length > 0 ? (
      greenhouses.map((greenhouse, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.cardTitle}>{greenhouse.greenhouse_name}</Text>
          <Text style={styles.cardSubtitle}>{greenhouse.year}</Text>
        </View>
      ))
    ) : (
      <Text style={styles.emptyText}>Žádný skleník nenalezen</Text>
    )}
  </View>
</View>

    <Text style={styles.title}>Kalendář</Text>
    <Calendar
    onDayPress={handleDayPress}
    monthFormat={'MMMM yyyy'}
    firstDay={1}
    markedDates={{
        ...markedDates,
        [date]: { selected: true, selectedColor: 'green' }, 
    }}
    theme={{
        todayTextColor: 'red',
        selectedDayBackgroundColor: 'green',
        arrowColor: 'green',
    }}
    />
     <AddButt title="Přidat záznam" onPress={() => setIsFormVisible(true)} />
    <Text style={styles.sectionTitle}>Vybraný den: </Text>
    <View style={styles.dateContainer}>
      <Text style={styles.dateText}>{moment(date).format('DD.MM.YYYY')}</Text>
    </View>

    <Text style={styles.sectionTitle}>Poznámky</Text>
    <View style={styles.noteBox}>
      <Text style={styles.noteText}>
        {selectedNote || 'Žádná poznámka pro tento den'}
      </Text>
    </View>

    <Text style={styles.sectionTitle}>Sklizeno plodů</Text>
    <View style={styles.harvestBox}>
      <Text style={styles.harvestText}>{selectedHarvest || '0'}</Text>
    </View>

    <Text style={styles.sectionTitle}>Obrázek</Text>
    {selectedPhoto ? (
      <Image source={{ uri: selectedPhoto }} style={styles.image} />
    ) : (
      <Text style={styles.emptyText}>Žádná fotka</Text>
    )}
      <Modal visible={isFormVisible} transparent={true} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text>Datum</Text>
            <Text>{date ? moment(date).format('DD.MM.YYYY') : 'Vyberte datum'}</Text>
            <Text>Úroda</Text>
            <TextInput
              style={styles.input}
              value={harvestAmount}
              keyboardType="numeric"
              onChangeText={(text) => setHarvestAmount(text)}
            />
            <Text>Poznámky</Text>
            <TextInput
              style={styles.input}
              value={notes}
              onChangeText={(text) => setNotes(text)}
            />
            <Text>Foto</Text>
            <PhotoButt onPress={pickImage} title={photo ? 'Změnit fotku' : 'Vyberte fotku'} />
            {photo ? <Image source={{ uri: photo }} style={styles.previewImage} /> : null}
            <View style={styles.butt}>
            <AddButt title="Uložit" onPress={handleSaveEntry} />
            <AddButt title="Zavřít" onPress={() => setIsFormVisible(false)} />
            </View>
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
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginTop: 20 
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fefae0',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  image: {
    width: width - 50,
    height: height/2,
    marginVertical: 10,
    borderRadius: 10,
  },
  noteContainer: {
    marginTop: 20,
  },
  selectedNote: {
    fontSize: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginVertical: 10,
  },
  listContainer: {
    marginVertical: 10,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4, 
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  butt: {
    flexDirection: 'row',
    gap: 5,
  },
  dateContainer: {
    backgroundColor: '#eaf2d7',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d6a4f',
  },
  noteBox: {
    backgroundColor: '#fefae0',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#b08968',
    marginBottom: 10,
  },
  noteText: {
    fontSize: 18,
    color: '#6a4c93',
  },
  harvestBox: {
    backgroundColor: '#f8d7da',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  harvestText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c1121f',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default PlantDetail;
