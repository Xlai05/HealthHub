import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FoodScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suggested Foods (Mock Data)</Text>
      <Text>- Eat more fruits (e.g., oranges, bananas)</Text>
      <Text>- Include whole grains and lean protein</Text>
      <Text>- Drink lots of water!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 10, fontWeight: 'bold' },
});
