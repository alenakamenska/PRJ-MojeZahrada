import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, StyleSheet, Image, TextInput, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { insertPlant, getAllPlants, getAllSeeds, deletePlant } from '../database'; 
import { Picker } from '@react-native-picker/picker'; 
import IconButt from '../components/IconButt';
import AddButt from '../components/AddButt'

const { width, height } = Dimensions.get('window');

const PlantsScreen = () => {
  const [plants, setPlants] = useState([]);
  const [seeds, setSeeds] = useState([]);
  const [selectedSeed, setSelectedSeed] = useState(null);
  const [newPlantName, setNewPlantName] = useState('');
  const [showModal, setShowModal] = useState(false);

  const loadSeeds = async () => {
    const allSeeds = await getAllSeeds();
    setSeeds(allSeeds);
  };

  const loadPlants = async () => {
    const allPlants = await getAllPlants();
    setPlants(allPlants);
  };

  useEffect(() => {
    loadSeeds();
    loadPlants();
  }, []);

  const addPlant = async () => {
    if (newPlantName && selectedSeed) {
      await insertPlant(newPlantName, selectedSeed.id);
      setShowModal(false);
      loadPlants();
      setNewPlantName('');
      setSelectedSeed(null);
    } else {
      alert('Zadejte název rostliny a vyberte semínko!');
    }
  };
  const handleDeletePlant = async (id) => {
    console.log('Mazání rostliny s ID:', id);
    try {
      await deletePlant(id);
      loadPlants();
    } catch (error) {
      console.error('Chyba při mazání rostliny:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Seznam rostlin</Text>
      <AddButt title="Přidat rostlinu" onPress={() => setShowModal(true)} />
      
      <Modal visible={showModal} animationType="slide" transparent={true} onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text>Název</Text>
            <TextInput
              style={styles.input}
              placeholder="Název rostliny"
              value={newPlantName}
              onChangeText={setNewPlantName}
            />
            <Text>Semínka</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedSeed}
                onValueChange={(itemValue) => setSelectedSeed(itemValue)}
                style={styles.picker}
              >
                {seeds.map((seed) => (
                  <Picker.Item key={seed.id} label={seed.purchase_place} value={seed} />
                ))}
              </Picker>
            </View>
            <View style={styles.butt}>
              <AddButt title="Přidat rostlinu" onPress={addPlant} />
              <AddButt title="Zavřít" onPress={() => setShowModal(false)} />
            </View>
          </View>
        </View>
      </Modal>
      
      <FlatList
        data={plants}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.plantItem}>
            <Image source={require('../assets/plant.png')} style={styles.plantImage} />
            <Text style={styles.plantName}>{item.name}</Text>
            <IconButt icon={'trash-sharp'} size={30} color={'#ff758f'} onPress={() => handleDeletePlant(item.id)} />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff'
  },
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20
  },
  plantItem: {
    width: width / 2 - 20,
    backgroundColor: '#e9edc9',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: 'center'
  },
  plantImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  plantName: {
    fontSize: 23,
    fontWeight: '400'
  },
  plantText: {
    fontSize: 18
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
    height: height / 3,
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
    gap: 5,
  },
  picker:{
    width: '100%',
  },
  pickerContainer: {
    width: '100%',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 2,
    overflow: 'hidden', 
  },
});

export default PlantsScreen;
