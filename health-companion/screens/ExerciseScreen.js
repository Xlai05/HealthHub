// screens/ExerciseScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ExerciseScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Exercises:</Text>
      <Text>- 15 minutes of walking daily</Text>
      <Text>- Stretching and yoga</Text>
      <Text>- Bodyweight exercises (e.g., squats, push-ups)</Text>
      <Text>- Deep breathing and relaxation</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  title: { fontSize: 18, marginBottom: 10 }
});
