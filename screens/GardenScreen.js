import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, Alert, Modal, ScrollView, Dimensions, Image } from 'react-native';
import { insertGreenhouse, getAllGreenhouses, updateGreenhouse, deleteGreenhouse } from '../database';
import IconButt from '../components/IconButt';
import AddButt from '../components/AddButt';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PhotoButt from '../components/PhotoButt';

const { width, height } = Dimensions.get('window');

export const GardenScreen = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [sklenikName, setSklenikName] = useState('');
  const [location, setLocation] = useState('');
  const [greenhouses, setGreenhouses] = useState([]);
  const [photo, setPhoto] = useState(''); 
  const navigation = useNavigation();
  const [editingGreenhouse, setEditingGreenhouse] = useState(null);

  const handleAddPress = async () => {
    setEditingGreenhouse(null);
    setSklenikName('');
    setLocation('');
    setPhoto('');
    setIsFormVisible(true);
  };

  const handleSave = async () => {
    if (sklenikName.trim() && location.trim()) {
      if (editingGreenhouse) {
        await updateGreenhouse(editingGreenhouse.id, sklenikName, location, photo);
      } else {
        await insertGreenhouse(sklenikName, location, photo);
      }
      setSklenikName('');
      setLocation('');
      setPhoto(''); 
      setIsFormVisible(false);
      loadGreenhouses();
      Alert.alert('Úspěch', editingGreenhouse ? 'Skleník byl aktualizován!' : 'Skleník byl přidán!');
    } else {
      Alert.alert('Chyba', 'Všechna pole musí být vyplněná!');
    }
  };

  const loadGreenhouses = async () => {
    const data = await getAllGreenhouses();
    setGreenhouses(data);
  };

  const handleDelete = async (id) => {
    await deleteGreenhouse(id);
    loadGreenhouses();
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
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

  useEffect(() => {
    loadGreenhouses();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Seznam skleniků</Text>
      <AddButt title="Přidat skleník" onPress={handleAddPress} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.greenhouseList}>
          {greenhouses.map((sklenik) => (
            <View key={sklenik.id} style={styles.greenhouseItem}>
              {sklenik.photo ? <Image source={{ uri: sklenik.photo }} style={styles.fieldImage} /> : null}
              <Text style={styles.GTextH}>{sklenik.name}</Text>
              <Text style={styles.GText}><Ionicons name="location-sharp" /> {sklenik.location}</Text>
              <View style={styles.icons}>
                <IconButt icon={'information-circle-sharp'} size={30} color={'#d4a373'} onPress={() => navigation.navigate('GreenHouseDetail', { greenhouseId: sklenik.id })} />
                <IconButt icon={'pencil-sharp'} size={30} onPress={() => {
                  setEditingGreenhouse(sklenik);
                  setSklenikName(sklenik.name);
                  setLocation(sklenik.location);
                  setPhoto(sklenik.photo);
                  setIsFormVisible(true);
                }} />
                <IconButt icon={'trash-sharp'} size={30} color={'#ff758f'} onPress={() => handleDelete(sklenik.id)} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={isFormVisible} animationType="slide" transparent={true} onRequestClose={() => setIsFormVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text>Název</Text>
            <TextInput style={styles.input} placeholder="Název skleníku" value={sklenikName} onChangeText={setSklenikName} />
            <Text>Lokalita</Text>
            <TextInput style={styles.input} placeholder="Lokalita" value={location} onChangeText={setLocation} />
            <PhotoButt onPress={pickImage} title={photo ? 'Změnit fotku' : 'Vyberte fotku'} />
            {photo ? <Image source={{ uri: photo }} style={styles.previewImage} /> : null}
            <View style={styles.butt}>
              <AddButt title={editingGreenhouse ? "Uložit změny" : "Uložit"} onPress={handleSave} />
              <AddButt title="Zavřít" onPress={() => setIsFormVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  greenhouseItem: {
    width: width/2 - 20,
    backgroundColor: '#dde5b6',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: 'flex-start',
    justifyContent: 'center',
    elevation: 5,
  },
  greenhouseList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fefae0',
    padding: 35,
    borderRadius: 10,
    width: width * 0.8,
    height: height / 2,
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
  butt: {
    flexDirection: 'row',
    gap: 20,
    marginTop: height/30,
    justifyContent:'center'
  },
  imageButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#d4a373',
    borderRadius: 5,
  },
  imageButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginVertical: 10,
  },
  icons: {
    flexDirection: 'row',
    gap: 20,
  },
  GText: {
    fontSize: 20,
    color: 'grey',
  },
  GTextH: {
    fontSize: 23,
    fontWeight: '600',
  },
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  fieldImage: {
    width: '100%',
    height: height/4,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'contain',
  },
});

export default GardenScreen;
