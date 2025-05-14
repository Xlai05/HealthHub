// screens/FoodScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FoodScreen() {
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    fetch('http://192.168.1.145:3000/foods')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched foods:', data);
        setFoods(data || []);
      })
      .catch((error) => {
        console.error('Error fetching foods:', error);
        setFoods([]);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Healthy Foods to Eat:</Text>
      {Array.isArray(foods) && foods.length > 0 ? (
        foods.map((food, index) => <Text key={index}>{food.name}</Text>)
      ) : (
        <Text>No foods available.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  title: { fontSize: 18, marginBottom: 10 },
});
