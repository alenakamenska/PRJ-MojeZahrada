import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Modal, TextInput, Dimensions, Image } from 'react-native';
import { useRoute } from '@react-navigation/native'; 
import { getPlantbyId, insertPlant, deletePlant, createPlantTables } from '../database'; 
import AddButt from '../components/AddButt';
import IconButt from '../components/IconButt';

const { width, height } = Dimensions.get('window');

const PlantScreen = () => {
  const route = useRoute(); 
  const { greenhouseId } = route.params;

  const [plants, setPlants] = useState([]); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [plantName, setPlantName] = useState('');
  const [PlantYear, setPlantYear] = useState('');

  const handleAddPress = async () => {
    setIsModalVisible(true); 
    await createPlantTables();  
  };

  useEffect(() => {
    if (!greenhouseId) {
      Alert.alert("Chyba", "Nebyl nalezen skleník pro načtení rostlin.");
      return;
    }
    loadPlants();  
  }, [greenhouseId]);

  const loadPlants = async () => {
    try {
      const data = await getPlantbyId(greenhouseId); 
      setPlants(data);
    } catch (error) {
      console.error("Chyba při načítání rostlin: ", error);
      Alert.alert("Chyba", "Nepodařilo se načíst rostliny.");
    }
  };

  const handleAddPlant = async () => {
    if (plantName.trim()) {
      try {
        await insertPlant(plantName, PlantYear, greenhouseId);
        setPlantName(''); 
        setIsModalVisible(false); 
        loadPlants();
      } catch (error) {
        Alert.alert("Chyba", "Nepodařilo se přidat rostlinu.");
      }
    } else {
      Alert.alert('Chyba', 'Název rostliny nesmí být prázdný!');
    }
  };

  const handleDeletePlant = async (id) => {
    try {
      await deletePlant(id); 
      loadPlants(); 
    } catch (error) {
      Alert.alert("Chyba", "Nepodařilo se smazat rostlinu.");
    }
  };

  return (
    <View style={styles.container}>
        <Text></Text>
        <AddButt title="Přidat rostlinu" onPress={handleAddPress} />
      <Text style={styles.h1}>Seznam Rostlin</Text>
      <FlatList
        data={plants}
        numColumns={2} 
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <View style={styles.plantItem}>
            <Image source={require('../assets/plant.png')} style={styles.plantImage} />
            <View>
                <Text style={styles.plantName}>{item.name}</Text>
                <Text style={styles.plantText}>Rok výsadby: {item.year}</Text>
            </View>
            <View>
                <IconButt icon={'trash-sharp'} size={30} color={'#ff758f'} onPress={() => handleDeletePlant(item.id)} />
            </View>
            </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListFooterComponent={<View style={{ height: 50 }} />} 
        />

      <Modal visible={isModalVisible} animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)} >
        <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
                <Text>Zadej název rostliny:</Text>
                <TextInput
                    style={styles.input}
                    value={plantName}
                    onChangeText={setPlantName}
                />
                <Text>Zadej rok výsadby:</Text>
                <TextInput
                style={styles.input}
                value={PlantYear}
                onChangeText={setPlantYear}
                keyboardType="numeric"
                />
                <View style={styles.butt}>
                    <AddButt title="Uložit" onPress={() => handleAddPlant()} />
                    <AddButt title="Zavřít" onPress={() => setIsModalVisible(false)} />
                </View>
            </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    alignItems:'center',
  },
  plantText: { 
    fontSize: 18
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
    height: height/3,
  },
  butt:{
    flexDirection:'row',
    gap: 5,
  },
  h1:{
    fontSize: 28,
    fontWeight:'bold'
  },
  plantItem: {
    width: width/2 - 20,
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
  plantList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  plantName:{
    fontSize: 23,
    fontWeight: '400'
  }, 
  plantImage:{
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'contain',
  }

});

export default PlantScreen;
