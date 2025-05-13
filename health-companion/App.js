import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import BodyPartSelectorScreen from './screens/BodyPartSelectScreen';
import FoodScreen from './screens/FoodScreen';
import ExerciseScreen from './screens/ExerciseScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Symptom Checker') {
              iconName = focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline';
            } else if (route.name === 'What to Eat') {
              iconName = focused ? 'nutrition' : 'nutrition-outline';
            } else if (route.name === 'Exercises') {
              iconName = focused ? 'barbell' : 'barbell-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#00b894',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Symptom Checker" component={BodyPartSelectorScreen} />
        <Tab.Screen name="What to Eat" component={FoodScreen} />
        <Tab.Screen name="Exercises" component={ExerciseScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
