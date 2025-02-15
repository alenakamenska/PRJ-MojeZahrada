import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useColorScheme } from 'react-native';

import Home, { HomeScreen } from "./screens/HomeScreen";
import Garden, { GardenScreen } from "./screens/GardenScreen";
import PlantScreen from './screens/PlantScreen'; 
import SeedsScreen from './screens/SeedsScreen';
import FieldsScreen from './screens/FieldsScreen';

export const SCREEN_HOME = "Home";
export const SCREEN_GARDEN = "Garden";
export const SCREEN_SEEDS = "Seeds";
export const SCREEN_FIELDS = "Fields";

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
        name="PlantScreen" 
        component={PlantScreen}  
        options={{ headerShown: false }}  
      />
    </Stack.Navigator>
  );
}


export default function App() {
  const scheme = useColorScheme();
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
              default: iconName = "information-circle";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#ccd5ae",
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name={SCREEN_HOME} component={Home} options={{ title: 'Vítejte', headerStyle: { backgroundColor: '#ccd5ae' } }} />
        <Tab.Screen name={SCREEN_GARDEN} component={GardenStack} options={{ title: 'Skleníky', headerStyle: { backgroundColor: '#ccd5ae' } }} />
        <Tab.Screen name={SCREEN_FIELDS} component={FieldsScreen} options={{ title: 'Záhony', headerStyle: { backgroundColor: '#ccd5ae' } }} />
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
