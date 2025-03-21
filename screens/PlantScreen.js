import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Image, TextInput, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { insertPlant, getAllPlants, getAllSeeds, deletePlant } from '../database'; 
import { Picker } from '@react-native-picker/picker'; 
import { useNavigation } from '@react-navigation/native';
import IconButt from '../components/IconButt';
import AddButt from '../components/AddButt';
import plantImages from '../components/plantImages';

const { width, height } = Dimensions.get('window');

const PlantsScreen = () => {
  const [plants, setPlants] = useState([]);
  const [seeds, setSeeds] = useState([]);
  const [selectedSeed, setSelectedSeed] = useState(null);
  const [newPlantName, setNewPlantName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const loadSeeds = async () => {
      const allSeeds = await getAllSeeds();
      setSeeds(allSeeds);
    };
    const loadPlants = async () => {
      const allPlants = await getAllPlants();
      setPlants(allPlants);
    };
    loadSeeds();
    loadPlants();
  }, []);


  const handleDeletePlant = async (id) => {
    await deletePlant(id);
    const allPlants = await getAllPlants();
    setPlants(allPlants);
  };

  useEffect(() => {
    const loadSeedsAndPlants = async () => {
      const allSeeds = await getAllSeeds();
      const allPlants = await getAllPlants();
      setSeeds(allSeeds);
      setPlants(allPlants);
    };
  
    loadSeedsAndPlants();
  }, [showModal]); 
  
  const addPlant = async () => {
    if (newPlantName) {
      await insertPlant(newPlantName, selectedSeed ? selectedSeed.id : null);
      setShowModal(false); 
    } else {
      alert('Zadejte název rostliny!');
    }
  };
  
  const handleOpenModal = () => {
    setNewPlantName('');
    setSelectedSeed(null);
    setShowModal(true);
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
            <Picker
              selectedValue={selectedSeed}
              onValueChange={(itemValue) => setSelectedSeed(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Bez semínka" value={null} />
              {seeds.map((seed) => (
                <Picker.Item key={seed.id} label={seed.purchase_place} value={seed} />
              ))}
            </Picker>
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
        renderItem={({ item }) => {
          const plantImage = plantImages[item.name.toLowerCase()] || require('../assets/plant.png'); 
          return (
            <View style={styles.plantItem}>
              <Image source={plantImage} style={styles.plantImage} />
              <Text style={styles.plantName}>{item.name}</Text>
              <View style={styles.iconContainer}>
                <IconButt icon={'trash-sharp'} size={30} color={'#ff758f'} onPress={() => handleDeletePlant(item.id)} />
                <IconButt 
                  icon={'information-circle-sharp'} 
                  size={30} 
                  color={'#d4a373'}  
                  onPress={() => navigation.navigate('PlantDetail', { plantId: item.id })}
                />
              </View>
            </View>
          );
        }}
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
    fontSize: 20,
    fontWeight: 'bold'
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10
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
});

export default PlantsScreen;