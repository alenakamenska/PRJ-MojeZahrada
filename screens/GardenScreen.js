import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Text,
  TextInput,
  Alert,
  Modal,
  ScrollView,
  Image
} from 'react-native';
import {
  insertSklenik,
  createSklenikTable,
  getAllGreenhouses,
  updateGreenhouse,
  deleteGreenhouse,
} from '../database';
import IconButt from '../components/IconButt';
import AddButt from '../components/AddButt';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export const GardenScreen = props => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [sklenikName, setSklenikName] = useState('');
  const [location, setLocation] = useState('');
  const [greenhouses, setGreenhouses] = useState([]);
  const navigation = useNavigation();

  const handleAddPress = async () => {
    setIsFormVisible(true);
    await createSklenikTable();
  };

  const handleSave = async () => {
    if (sklenikName.trim() && location.trim()) {
      await insertSklenik(sklenikName, location);
      setSklenikName('');
      setLocation('');
      setIsFormVisible(false);
      loadGreenhouses();
      Alert.alert('Úspěch', 'Skleník byl přidán!');
    } else {
      Alert.alert('Chyba', 'Všechna pole musí být vyplněná!');
    }
  };
  const loadGreenhouses = async () => {
    const data = await getAllGreenhouses();
    setGreenhouses(data);
  };

  const handleUpdate = async (id, name, location) => {
    await updateGreenhouse(id, name, location);
    loadGreenhouses();
  };

  const handleDelete = async (id) => {
    await deleteGreenhouse(id);
    loadGreenhouses();
  };

  useEffect(() => {
    loadGreenhouses();
  }, []);

  return (
    <View style={styles.container}>
      {/* <ImageBackground
        source={require('../assets/garden.jpg')}
        style={styles.image}
        imageStyle={styles.imageStyle}>
        <View style={styles.overlay} /> */}

        <AddButt title="Přidat skleník" onPress={handleAddPress} />
        <Text style={styles.h1}>Seznam skleniků</Text>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.greenhouseList}>
            {greenhouses.map((sklenik) => (
              <View key={sklenik.id} style={styles.greenhouseItem}>
                <Text style={styles.GTextH}> {sklenik.name}</Text>
                <Text style={styles.GText}>Lokalita - {sklenik.location}</Text>
                <View style={styles.icons}>
                  <IconButt icon={'information-circle-sharp'} size={30} color={'#d4a373'}
                    onPress={() => navigation.navigate('PlantScreen', { greenhouseId: sklenik.id })}
                  />
                  <IconButt icon={'pencil-sharp'} size={30}
                    onPress={() => handleUpdate(sklenik.id, sklenik.name, sklenik.location)}
                  />
                  <IconButt icon={'trash-sharp'} size={30} color={'#ff758f'}
                    onPress={() => handleDelete(sklenik.id)}
                  />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        <Modal
          visible={isFormVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setIsFormVisible(false)}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text>Název</Text>
              <TextInput
                style={styles.input}
                placeholder="Název skleníku"
                value={sklenikName}
                onChangeText={setSklenikName}
              />
              <Text>Lokalita</Text>
              <TextInput
                style={styles.input}
                placeholder="Lokalita"
                value={location}
                onChangeText={setLocation}
              />
              <View style={styles.butt}>
                <AddButt title="Uložit" onPress={handleSave} />
                <AddButt title="Zavřít" onPress={() => setIsFormVisible(false)} />
              </View>
            </View>
          </View>
        </Modal>
      {/* </ImageBackground> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    /*backgroundColor: 'rgb(225, 231, 207)',*/
    alignItems:'center',
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  greenhouseItem: {
    width: '85%',
    backgroundColor: '#dde5b6',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'left',
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
    width: width*0.8,
    height: height/3,
  },
  butt: {
    flexDirection: 'row',
    gap: 5,
  },
  icons: {
    flexDirection: 'row',
  },
  GText: {
    fontSize: 20,
    color:'grey',
  },
  GTextH: {
    fontSize: 23,
    fontWeight:'600'
  },
  h1:{
    fontSize: 28,
    fontWeight:'bold'
  },
  plantImage:{
    width: '100%',
    height: 100,
    borderRadius: 10,
    marginBottom: 10,
    resizeMode: 'contain',
  }
});

export default GardenScreen;
