import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TextInput, Alert, TouchableOpacity, Image, Dimensions } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import 'moment/locale/cs';
import * as ImagePicker from 'expo-image-picker';
import { getPlantById, getPlantsInFieldDet, getPlantsInGreenhouseDet, getPlantCalendar, insertPlantCalendarEntry } from '../database';
import AddButt from '../components/AddButt';

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
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
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
  const showDatePicker = () => {
    setDatePickerVisibility(true);
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
    } else {
      setSelectedNote('');
      setSelectedPhoto('');  
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

      <Text style={styles.sectionTitle}>Záhony</Text>
      {fields.length > 0 ? (
        fields.map((field, index) => (
          <Text key={index}>{field.field_name} ({field.year})</Text>
        ))
      ) : (
        <Text>Žádné pole nenalezeno</Text>
      )}

      <Text style={styles.sectionTitle}>Skleníky</Text>
      {greenhouses.length > 0 ? (
        greenhouses.map((greenhouse, index) => (
          <Text key={index}>{greenhouse.greenhouse_name} ({greenhouse.year})</Text>
        ))
      ) : (
        <Text>Žádný skleník nenalezen</Text>
      )}

      <AddButt title="Přidat záznam" onPress={() => setIsFormVisible(true)} />
    <Text style={styles.title}>Kalendář</Text>
      <Calendar
        onDayPress={handleDayPress}
        monthFormat={'MMMM yyyy'}
        firstDay={1}
        markedDates={markedDates}
        theme={{
          todayTextColor: 'brown',
          arrowColor: 'green',
        }}
      />
      <Text style={styles.title}>Poznámky</Text>
      <View style={styles.noteContainer}>
        {selectedNote ? (
          <Text style={styles.selectedNote}>
            Poznámka pro {moment(date).format('DD.MM.YYYY')}: {selectedNote}
          </Text>
        ) : (
          <Text style={styles.selectedNote}>
            Žádná poznámka pro {moment(date).format('DD.MM.YYYY')}
          </Text>
        )}
        {selectedPhoto ? (
          <Image source={{ uri: selectedPhoto }} style={styles.image} />
        ) : null}
      </View>
      <Modal visible={isFormVisible} transparent={true} animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text>Datum</Text>
            <TouchableOpacity onPress={showDatePicker}>
              <Text>{date ? moment(date).format('DD.MM.YYYY') : 'Vyberte datum'}</Text>
            </TouchableOpacity>
            <Text>Foto</Text>
            <TouchableOpacity onPress={pickImage}>
              <Text>{photo ? 'Změnit fotku' : 'Vyberte fotku'}</Text>
            </TouchableOpacity>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.image} />
            ) : null}
            <Text>Úroda</Text>
            <TextInput
              style={styles.input}
              value={harvestAmount}
              onChangeText={(text) => setHarvestAmount(text)}
            />
            <Text>Poznámky</Text>
            <TextInput
              style={styles.input}
              value={notes}
              onChangeText={(text) => setNotes(text)}
            />
            <AddButt title="Uložit" onPress={handleSaveEntry} />
            <AddButt title="Zavřít" onPress={() => setIsFormVisible(false)} />
          </View>
        </View>
      </Modal>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={new Date(date)}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
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
  }
});

export default PlantDetail;
