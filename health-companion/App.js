import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import BodyPartSelectorScreen from './screens/BodyPartSelectScreen';

export default function App() {
  return (
    <NavigationContainer>
      <BodyPartSelectorScreen />
    </NavigationContainer>
  );
}
