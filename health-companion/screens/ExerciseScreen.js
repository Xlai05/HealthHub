// screens/ExerciseScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ExerciseScreen() {
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    fetch('http://192.168.1.145:3000/exercises')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched exercises:', data);
        setExercises(data || []);
      })
      .catch((error) => {
        console.error('Error fetching exercises:', error);
        setExercises([]);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exercises to Stay Fit:</Text>
      {Array.isArray(exercises) && exercises.length > 0 ? (
        exercises.map((exercise, index) => <Text key={index}>{exercise.name}</Text>)
      ) : (
        <Text>No exercises available.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  title: { fontSize: 18, marginBottom: 10 },
});
