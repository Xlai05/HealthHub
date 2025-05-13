import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import ChatScreen from './screens/ChatScreen';
import FoodScreen from './screens/FoodScreen';
import ExerciseScreen from './screens/ExerciseScreen';


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Symptom Checker" component={ChatScreen} />
        <Tab.Screen name="What to Eat" component={FoodScreen} />
        <Tab.Screen name="Exercises" component={ExerciseScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
