import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ExerciseScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Exercises</Text>
      <Text>- 10 mins stretching</Text>
      <Text>- 20 mins walking or jogging</Text>
      <Text>- Light bodyweight exercises</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 10, fontWeight: 'bold' },
});
