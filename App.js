import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'; 
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from "./screens/HomeScreen";
import GardenScreen from "./screens/GardenScreen";
import SeedsScreen from './screens/SeedsScreen';
import FieldsScreen from './screens/FieldsScreen';
import PlantScreen from './screens/PlantScreen';
import { createTables } from './database'; 
import GreenHouseDetail from './screens/GreenHouseDetail';
import FieldDetail from './screens/FieldDetail';
import PlantDetail from './screens/PlantDetail';

export const SCREEN_HOME = "HomeScreen";
export const SCREEN_GARDEN = "GardenMain";
export const SCREEN_SEEDS = "SeedsMain";
export const SCREEN_FIELDS = "FieldsMain";
export const SCREEN_PLANTS = "PlantsMain";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();  

function GardenStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="GardenOverview" 
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
        name="FieldsOverview" 
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
        name="PlantsOverview" 
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
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeMain" 
        component={Home} 
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="GardenScreen" 
        component={GardenScreen}  
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="SeedsScreen" 
        component={SeedsScreen}  
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="PlantScreen" 
        component={PlantScreen}  
        options={{ headerShown: false }}  
      />
      <Stack.Screen 
        name="FieldsScreen" 
        component={FieldsScreen}  
        options={{ headerShown: false }}  
      />
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    createTables().then(() => {
      console.log('Tabulky byly vytvořeny nebo již existují.');
    }).catch(error => {
      console.error('Chyba při vytváření tabulek:', error);
    });
  }, []);

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#ccd5ae" />
      <Tab.Navigator
        initialRouteName={SCREEN_HOME}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            switch (route.name) {
              case SCREEN_HOME: iconName = "home-sharp"; break;
              case SCREEN_GARDEN: iconName = "leaf-sharp"; break;
              case SCREEN_SEEDS: iconName = "water-sharp"; break;
              case SCREEN_FIELDS: iconName = "flower-sharp"; break;
              case SCREEN_PLANTS: iconName = "nutrition-sharp"; break;
              default: iconName = "information-circle";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#ccd5ae",
          tabBarInactiveTintColor: 'black',
        })}
      >
        <Tab.Screen name={SCREEN_HOME} component={HomeStack} options={{ title: 'Vítejte', headerStyle: { backgroundColor: '#ccd5ae' } }} />
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
