import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions, Text, Button, TextInput, Alert, Modal, Image, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { createSeedsTable, insertSeed, deleteSeed, updateSeed, getAllSeeds } from '../database';
import IconButt from '../components/IconButt';
import AddButt from '../components/AddButt';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PhotoButt from '../components/PhotoButt'

const { width, height } = Dimensions.get('window');

export const SeedsScreen = props => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchasePlace, setPurchasePlace] = useState('');
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState(null); 
  const [quantity, setQuantity] = useState('');
  const [seeds, setSeeds] = useState([]);

  const handleAddPress = async () => {
    setIsFormVisible(true);
    await createSeedsTable();
  };

  const handleSave = async () => {
    if (purchaseDate.trim() && purchasePlace.trim() && price.trim() && quantity.trim()) {
      await insertSeed(purchaseDate, purchasePlace, parseFloat(price), photo, parseInt(quantity), false);
      setPurchaseDate('');
      setPurchasePlace('');
      setPrice('');
      setPhoto(null);
      setQuantity('');
      setIsFormVisible(false);
      loadSeeds();
      Alert.alert('Úspěch', 'Semínko bylo přidáno!');
    } else {
      Alert.alert('Chyba', 'Všechna povinná pole musí být vyplněná!');
    }
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

  const loadSeeds = async () => {
    const data = await getAllSeeds();
    setSeeds(data);
  };

  const handleUpdate = async (id, newPurchaseDate, newPurchasePlace, newPrice, newPhoto, newQuantity) => {
    await updateSeed(id, newPurchaseDate, newPurchasePlace, parseFloat(newPrice), newPhoto, parseInt(newQuantity), false);
    loadSeeds();
  };

  const handleDelete = async (id) => {
    await deleteSeed(id);
    loadSeeds();
  };

  useEffect(() => {
    loadSeeds();
  }, []);

  return (
    <View style={styles.container}>
        <Modal
          visible={isFormVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsFormVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text>Rok nákupu</Text>
              <TextInput
                style={styles.input}
                placeholder="2025"
                value={purchaseDate}
                keyboardType="numeric"
                onChangeText={setPurchaseDate}
              />
              <Text>Místo nákupu</Text>
              <TextInput
                style={styles.input}
                placeholder="Obchod, trh apod."
                value={purchasePlace}
                onChangeText={setPurchasePlace}
              />
              <Text>Cena</Text>
              <TextInput
                style={styles.input}
                placeholder="Cena v Kč"
                value={price}
                keyboardType="numeric"
                onChangeText={setPrice}
              />
              <Text>Množství</Text>
              <TextInput
                style={styles.input}
                placeholder="Počet"
                value={quantity}
                keyboardType="numeric"
                onChangeText={setQuantity}
              />
              <Text>Fotka</Text>
              <PhotoButt onPress={pickImage} title={photo ? 'Změnit fotku' : 'Vyberte fotku'} />
              {photo ? <Image source={{ uri: photo }} style={styles.previewImage} /> : null}
              <View style={styles.butt}>
                <AddButt title="Uložit" onPress={handleSave} />
                <AddButt title="Zavřít" onPress={() => setIsFormVisible(false)} />
              </View>
            </View>
          </View>
        </Modal>
        <View>
          <AddButt title="Přidat semínka" onPress={handleAddPress} />
        </View>
        <Text style={styles.h1}>Seznam osiva</Text>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.seedList}>
          {seeds.map((seed) => (
            <View key={seed.id} style={styles.seedItem}>
              {seed.photo && <Image source={{ uri: seed.photo }} style={styles.seedImage} />}
              <View style={styles.row}>
                <View style={styles.textContainer}>
                  <Text style={styles.GText}><Ionicons name="calendar-sharp"></Ionicons> {seed.purchase_date}</Text>
                  <Text style={styles.GText}><Ionicons name="location-sharp"></Ionicons> {seed.purchase_place}</Text>
                  <Text style={styles.GText}>{seed.price} Kč</Text>
                  <Text style={styles.GText}>{seed.quantity} ks</Text>
                </View>
                <View style={styles.icons}>
                  <IconButt icon={'pencil-sharp'} size={30} onPress={() => handleUpdate(seed.id, seed.purchase_date, seed.purchase_place, seed.price, seed.photo, seed.quantity)} style={styles.change}/>
                  <IconButt icon={'trash-sharp'} size={30} color={'#ff758f'} onPress={() => handleDelete(seed.id)} style={styles.delete}/>
                </View>
              </View>
            </View>
          ))}
        </View>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10
  },
  image: {
    width: width,
    height: height,
  },
  imageStyle: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
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
  seedItem: {
    width: width/2 - 30,
    backgroundColor: '#e9edc9',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  seedImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  photoButton: {
    backgroundColor: '#a5d6a7',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  photoButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  butt: {
    flexDirection: 'row',
    gap: 5,
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
    width: '90%',
    alignItems: 'left',
    height: height/2,
  },
  seedList: {
    alignItems: 'center',
    paddingTop: 10,
    flexDirection: 'row',
    flexWrap:'wrap'
  },
  GText: { 
    fontSize: 18,
  },
  GTextH: { 
    fontSize: 23,
  },
  row: {
    flexDirection: 'row',
    gap: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  icons: {
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  change: {
    marginRight: 10,
  },
  delete: {
    marginLeft: 10,
  },
  h1:{
    fontSize: 28,
    fontWeight:'bold',
    textAlign:'center'
  },
});

export default SeedsScreen;
