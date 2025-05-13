// screens/FoodScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FoodScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Healthy Foods to Eat:</Text>
      <Text>- Fruits like bananas and apples</Text>
      <Text>- Leafy greens (e.g., spinach, kale)</Text>
      <Text>- Lean proteins like chicken or tofu</Text>
      <Text>- Lots of water!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  title: { fontSize: 18, marginBottom: 10 }
});
