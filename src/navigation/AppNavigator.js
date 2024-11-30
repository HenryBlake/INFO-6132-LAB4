import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import EventListScreen from '../screens/EventListScreen';
import FavouriteScreen from '../screens/FavouriteScreen';
import AddEventScreenr from '../screens/AddEventScreen';
import EditEventScreen from '../screens/EditEventScreen';
const Stack = createStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Events" component={EventListScreen} />
      <Stack.Screen name="AddEvent" component={AddEventScreenr} />
      <Stack.Screen name="Favourites" component={FavouriteScreen} />
      <Stack.Screen name="EditEvent" component={EditEventScreen} />    
     </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
