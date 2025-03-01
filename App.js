import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useColorScheme } from 'react-native';

import Home from "./screens/HomeScreen";
import GardenScreen from "./screens/GardenScreen";
import SeedsScreen from './screens/SeedsScreen';
import FieldsScreen from './screens/FieldsScreen';
import PlantScreen from './screens/PlantScreen';
import { createTables } from './database'; 
import GreenHouseDetail from './screens/GreenHouseDetail';
import FieldDetail from './screens/FieldDetail';
import PlantDetail from './screens/PlantDetail';

export const SCREEN_HOME = "Home";
export const SCREEN_GARDEN = "Garden";
export const SCREEN_SEEDS = "Seeds";
export const SCREEN_FIELDS = "Fields";
export const SCREEN_PLANTS = "Plants";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();  


function GardenStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name={SCREEN_GARDEN} 
        component={GardenScreen} 
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="GreenHouseDetail" 
        component={GreenHouseDetail}  
        options={{ headerShown: false }}  
      />
    </Stack.Navigator>
  );
}

function FieldStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name={SCREEN_FIELDS} 
        component={FieldsScreen} 
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="FieldDetail" 
        component={FieldDetail}  
        options={{ headerShown: false }}  
      />
    </Stack.Navigator>
  );
}

function PlantStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name={SCREEN_PLANTS} 
        component={PlantScreen} 
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="PlantDetail" 
        component={PlantDetail}  
        options={{ headerShown: false }}  
      />
    </Stack.Navigator>
  );
}


export default function App() {
  const scheme = useColorScheme();
  useEffect(() => {
    createTables().then(() => {
      console.log('Tabulky byly vytvořeny nebo již existují.');
    }).catch(error => {
      console.error('Chyba při vytváření tabulek:', error);
    });
  }, []);
  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar barStyle="light-content" backgroundColor="#ccd5ae" />
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            switch (route.name) {
              case SCREEN_HOME: iconName = "home-sharp"; break;
              case SCREEN_GARDEN: iconName = "leaf-sharp"; break;
              case SCREEN_SEEDS: iconName = "water-sharp"; break
              case SCREEN_FIELDS: iconName = "flower-sharp"; break
              case SCREEN_PLANTS : iconName = "nutrition-sharp"; break
              default: iconName = "information-circle";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#ccd5ae",
          tabBarInactiveTintColor: 'black',
        })}
      >
        <Tab.Screen name={SCREEN_HOME} component={Home} options={{ title: 'Vítejte', headerStyle: { backgroundColor: '#ccd5ae' } }} />
        <Tab.Screen name={SCREEN_GARDEN} component={GardenStack} options={{ title: 'Skleníky', headerStyle: { backgroundColor: '#ccd5ae' } }} />
        <Tab.Screen name={SCREEN_FIELDS} component={FieldStack} options={{ title: 'Záhony', headerStyle: { backgroundColor: '#ccd5ae' } }} />
        <Tab.Screen name={SCREEN_PLANTS} component={PlantStack} options={{ title: 'Rostliny', headerStyle: { backgroundColor: '#ccd5ae' } }} />
        <Tab.Screen name={SCREEN_SEEDS} component={SeedsScreen} options={{ title: 'Osivo', headerStyle: { backgroundColor: '#ccd5ae' } }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
