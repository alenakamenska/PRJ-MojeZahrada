import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert, Modal, TextInput, Dimensions, Image } from 'react-native';
import { useRoute } from '@react-navigation/native'; 
import { getAllPlants, getPlantsInField, addPlantToField, removePlantFromField } from '../database'; 
import AddButt from '../components/AddButt';
import IconButt from '../components/IconButt';
import { Picker } from '@react-native-picker/picker';
import plantImages from '../components/plantImages';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const GreenHouseDetail = () => {
  const route = useRoute(); 
  const { fieldId } = route.params;

  const [plants, setPlants] = useState([]); 
  const [allPlants, setAllPlants] = useState([]); 
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [PlantYear, setPlantYear] = useState('');
  const [PlantCount, setPlantCount] = useState('');

  useEffect(() => {
    if (!fieldId) {
      Alert.alert("Chyba", "Nebyl nalezen skleník pro načtení rostlin.");
      return;
    }
    loadPlants();
    loadAllPlants(); 
  }, [fieldId]);

  const loadPlants = async () => {
    try {
      const data = await getPlantsInField(fieldId);
      setPlants(data);
    } catch (error) {
      console.error("Chyba při načítání rostlin ve skleníku: ", error);
      Alert.alert("Chyba", "Nepodařilo se načíst rostliny.");
    }
  };
  
  const loadAllPlants = async () => {
    try {
      const data = await getAllPlants(); 
      setAllPlants(data);
    } catch (error) {
      console.error("Chyba při načítání seznamu rostlin: ", error);
      Alert.alert("Chyba", "Nepodařilo se načíst seznam rostlin.");
    }
  };

  const handleAddPlant = async () => {
    if (!selectedPlant || !PlantYear.trim() || !PlantCount.trim()) {
      Alert.alert('Chyba', 'Vyberte rostlinu a zadejte všechny údaje!');
      return;
    }
  
    console.log("Přidávám rostlinu:", {
      plantId: selectedPlant,
      greenhouseId: fieldId,
      year: PlantYear,
      count: PlantCount,
    });
  
    try {
      await addPlantToField(selectedPlant, fieldId, PlantYear, PlantCount);
      setIsModalVisible(false);
      loadPlants();
    } catch (error) {
      console.error("Chyba při přidávání rostliny:", error);
      Alert.alert("Chyba", "Nepodařilo se přidat rostlinu.");
    }
  };

  const handleDeletePlant = async (id, year) => { 
    try {
      await removePlantFromField(fieldId, id, year);
      loadPlants();  
    } catch (error) {
      console.error("Chyba při odstraňování rostliny:", error);
      Alert.alert("Chyba", "Nepodařilo se odstranit rostlinu.");
    }
  };

  
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Seznam Rostlin</Text>
      <AddButt title="Přidat rostlinu" onPress={() => setIsModalVisible(true)} />
      <FlatList
        data={plants}
        numColumns={2} 
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const nameLower = item.name.toLowerCase();
          let plantImage = require('../assets/plant.png');
          for (const key in plantImages) {
            if (nameLower.includes(key)) {
              plantImage = plantImages[key];
              break;
            }
          }
          return (
            <View style={styles.plantItem}>
            <Image source={plantImage} style={styles.plantImage} />
            <View>
                <Text style={styles.plantName}>{item.name}</Text>
                <Text style={styles.plantText}><Ionicons name="calendar-sharp"></Ionicons> {item.year}</Text>
                <Text style={styles.plantText}>Počet semen: {item.count}</Text>
            </View>
            <View>
                <IconButt icon={'trash-sharp'} size={30} color={'#ff758f'} onPress={() => handleDeletePlant(item.id, item.year)} />
            </View>
            </View>
        );
      }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListFooterComponent={<View style={{ height: 50 }} />} 
        />

      <Modal visible={isModalVisible} animationType="slide"
          transparent={true}
          onRequestClose={() => setIsModalVisible(false)} >
        <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
                <Text>Vyberte rostlinu:</Text>
                <Picker
                  selectedValue={selectedPlant}
                  onValueChange={(itemValue) => setSelectedPlant(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Vyberte rostlinu..." value={null} />
                  {allPlants.map((plant) => (
                    <Picker.Item key={plant.id} label={plant.name} value={plant.id} />
                  ))}
                </Picker>
                
                <Text>Zadej rok výsadby:</Text>
                <TextInput
                style={styles.input}
                value={PlantYear}
                onChangeText={setPlantYear}
                keyboardType="numeric"
                />

                <Text>Zadej počet semen:</Text>
                <TextInput
                style={styles.input}
                value={PlantCount}
                onChangeText={setPlantCount}
                keyboardType="numeric"
                />

                <View style={styles.butt}>
                    <AddButt title="Uložit" onPress={handleAddPlant} />
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
    height: height/2,
  },
  butt:{
    flexDirection:'row',
    gap: 5,
  },
  h1:{
    fontSize: 28,
    fontWeight:'bold'
  },
  picker: {
    width: '100%',
    height: 50,
    marginBottom: 10,
  },
  plantItem: {
    width: width/2 - 20,
    backgroundColor: '#e9edc9',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 5,
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

export default GreenHouseDetail;
