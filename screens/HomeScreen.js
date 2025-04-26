import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions, Text } from 'react-native';
import AddButt from '../components/AddButt';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export const HomeScreen = props => {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/garden.jpg')}
        style={styles.image}
        imageStyle={styles.imageStyle}>
        <View style={styles.overlay} />
        <View style={styles.rectangle}>
          <Text style={styles.h1}>Vítejte v aplikaci Moje Zahrada</Text>
          <Text style={styles.h2}>Sledujte své rostliny, plánujte výsadbu a mějte svůj skleník vždy pod kontrolou!</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
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
  rectangle: {
    width: width / 1.1,
    height: height / 3.5,
    backgroundColor: 'rgba(255, 255, 255, 0)',
    borderRadius: 50,
    marginBottom: height * 0.3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  h1: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
    fontWeight: 'bold',
    color: 'white'
  },
  h2: {
    fontSize: 20,
    marginTop: 10,
    color: 'white'
  },
});

export default HomeScreen;
