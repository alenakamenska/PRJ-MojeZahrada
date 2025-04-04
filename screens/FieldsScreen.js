import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  Modal,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import {
  insertField,
  getAllFields,
  updateField,
  deleteField
} from '../database';
import IconButt from '../components/IconButt';
import AddButt from '../components/AddButt';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PhotoButt from '../components/PhotoButt';

const { width, height } = Dimensions.get('window');

export const FieldsScreen = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [fieldName, setFieldName] = useState('');
  const [location, setLocation] = useState('');
  const [soilType, setSoilType] = useState('');
  const [photo, setPhoto] = useState('');
  const [fields, setFields] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const navigation = useNavigation();

  const loadFields = async () => {
    const data = await getAllFields();
    setFields(data);
  };

  useEffect(() => {
    loadFields();
  }, []);

  const handleAddPress = () => {
    setEditingField(null);
    setFieldName('');
    setLocation('');
    setSoilType('');
    setPhoto('');
    setIsFormVisible(true);
  };

  const handleEditPress = (field) => {
    setEditingField(field);
    setFieldName(field.name);
    setLocation(field.location);
    setSoilType(field.soil_type);
    setPhoto(field.photo);
    setIsFormVisible(true);
  };

  const handleSave = async () => {
    if (fieldName.trim() && location.trim() && soilType.trim()) {
      if (editingField) {
        await updateField(editingField.id, fieldName, location, soilType, photo);
      } else {
        await insertField(fieldName, location, soilType, photo);
      }
      setIsFormVisible(false);
      loadFields();
      Alert.alert('Úspěch', editingField ? 'Záhon byl upraven!' : 'Záhon byl přidán!');
    } else {
      Alert.alert('Chyba', 'Všechna pole musí být vyplněná!');
    }
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

  const handleDelete = async (id) => {
    await deleteField(id);
    loadFields();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Seznam záhonů</Text>
      <AddButt title="Přidat záhon" onPress={handleAddPress} />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.fieldList}>
          {fields.map((field) => (
            <View key={field.id} style={styles.fieldItem}>
              {field.photo ? <Image source={{ uri: field.photo }} style={styles.fieldImage} /> : null}
              <Text style={styles.FTextH}>{field.name}</Text>
              <Text style={styles.FText}><Ionicons name="location-sharp" /> {field.location}</Text>
              <Text style={styles.FText}>Typ půdy: {field.soil_type}</Text>
              <View style={styles.icons}>
                <IconButt icon={'information-circle-sharp'} size={30} color={'#d4a373'}
                  onPress={() => navigation.navigate('FieldDetail', { fieldId: field.id })} />
                <IconButt icon={'pencil-sharp'} size={30} onPress={() => handleEditPress(field)} />
                <IconButt icon={'trash-sharp'} size={30} color={'#ff758f'} onPress={() => handleDelete(field.id)} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Modal visible={isFormVisible} animationType="slide" transparent={true} onRequestClose={() => setIsFormVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text>Název</Text>
            <TextInput style={styles.input} placeholder="Název záhonu" value={fieldName} onChangeText={setFieldName} />
            <Text>Lokalita</Text>
            <TextInput style={styles.input} placeholder="Lokalita" value={location} onChangeText={setLocation} />
            <Text>Typ půdy</Text>
            <TextInput style={styles.input} placeholder="Typ půdy" value={soilType} onChangeText={setSoilType} />
            <PhotoButt onPress={pickImage} title={photo ? 'Změnit fotku' : 'Vyberte fotku'} />
            {photo ? <Image source={{ uri: photo }} style={styles.previewImage} /> : null}
            <View style={styles.butt}>
              <AddButt title={editingField ? "Uložit změny" : "Uložit"} onPress={handleSave} />
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
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  fieldItem: {
    width: width/2 - 20,
    backgroundColor: '#dde5b6',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    elevation: 5,
  },
  fieldList: {
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
    height: height / 1.8,
  },
  butt: {
    flexDirection: 'row',
    gap: 20,
    marginTop: height/100,
    justifyContent:'center'
  },
  icons: {
    flexDirection: 'row',
    gap: 20,
  },
  FText: {
    fontSize: 20,
    color: 'grey',
  },
  FTextH: {
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
  emptyMessage: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginVertical: 10,
  },
});

export default FieldsScreen;
