import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Import icons
import BodyPartButton from '../components/BodyPartButton';

const Tab = createBottomTabNavigator();

export default function BodyPartSelectorScreen() {
  const [bodyParts, setBodyParts] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [otcMedicines, setOtcMedicines] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [foods, setFoods] = useState([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [selectedSymptom, setSelectedSymptom] = useState('');

  useEffect(() => {
    // Fetch body parts from the backend
    fetch('http://192.168.1.145:3000/symptom-recommendations')
      .then((response) => response.json())
      .then((data) => {
        const uniqueBodyParts = [...new Map(data.map(item => [item.body_part, item])).values()];
        setBodyParts(uniqueBodyParts);
      })
      .catch((error) => console.error('Error fetching body parts:', error));
  }, []);

  const handleBodyPartSelect = (bodyPart) => {
    setSelectedBodyPart(bodyPart);
    setSymptoms([]);
    setOtcMedicines([]);
    setExercises([]);
    setFoods([]);

    // Fetch symptoms for the selected body part
    fetch(`http://192.168.1.145:3000/symptoms/${bodyPart}`)
      .then((response) => response.json())
      .then((data) => setSymptoms(data.map((item) => item.symptom)))
      .catch((error) => console.error('Error fetching symptoms:', error));
  };

  const handleSymptomSelect = (symptom) => {
    setSelectedSymptom(symptom);
    setOtcMedicines([]);
    setExercises([]);
    setFoods([]);

    // Fetch OTC medicines, exercises, and food suggestions for the selected symptom
    fetch(`http://192.168.1.145:3000/otc-medicines/${symptom}`)
      .then((response) => response.json())
      .then((data) => setOtcMedicines(data))
      .catch((error) => console.error('Error fetching OTC medicines:', error));

    fetch(`http://192.168.1.145:3000/exercises/${symptom}`)
      .then((response) => response.json())
      .then((data) => setExercises(data.map((item) => item.exercise)))
      .catch((error) => console.error('Error fetching exercises:', error));

    fetch(`http://192.168.1.145:3000/foods/${symptom}`)
      .then((response) => response.json())
      .then((data) => setFoods(data.map((item) => item.food_suggestion)))
      .catch((error) => console.error('Error fetching foods:', error));
  };

  const handleBack = () => {
    if (selectedSymptom) {
      setSelectedSymptom('');
      setOtcMedicines([]);
      setExercises([]);
      setFoods([]);
    } else if (selectedBodyPart) {
      setSelectedBodyPart('');
      setSymptoms([]);
    }
  };

  const SymptomsScreen = () => (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.subtitle}>Select a symptom for {selectedBodyPart}:</Text>
      {Array.isArray(symptoms) && symptoms.length > 0 ? (
        symptoms.map((symptom, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.button, { backgroundColor: '#4CAF50' }]} // Match body part button color
            onPress={() => handleSymptomSelect(symptom)}
          >
            <Text style={styles.buttonText}>{symptom.toString()}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No symptoms available for this body part.</Text>
      )}
      <TouchableOpacity style={[styles.button, { backgroundColor: '#f44336' }]} onPress={handleBack}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const MedicinesScreen = () => (
    <View style={styles.container}>
      <Text style={styles.subtitle}>OTC Medicines for {selectedSymptom}:</Text>
      {otcMedicines.map((medicine, index) => (
        <Text key={index} style={styles.response}>
          {medicine.medicine_name}: {medicine.medicine_description}
        </Text>
      ))}
      <TouchableOpacity style={[styles.button, { backgroundColor: '#f44336' }]} onPress={handleBack}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );

  const ExercisesScreen = () => (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Exercises for {selectedSymptom}:</Text>
      {exercises.map((exercise, index) => (
        <Text key={index} style={styles.response}>
          {exercise}
        </Text>
      ))}
    </View>
  );

  const FoodsScreen = () => (
    <View style={styles.container}>
      <Text style={styles.subtitle}>What to Eat for {selectedSymptom}:</Text>
      {foods.map((food, index) => (
        <Text key={index} style={styles.response}>
          {food}
        </Text>
      ))}
    </View>
  );

  if (!selectedBodyPart) {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Select a body part to indicate your pain:</Text>
        {bodyParts.map((part) => (
          <TouchableOpacity
            key={part.body_part}
            style={[styles.button, { backgroundColor: '#4CAF50' }]} // Match button color
            onPress={() => handleBodyPartSelect(part.body_part)}
          >
            <Text style={styles.buttonText}>{part.body_part}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  if (!selectedSymptom) {
    return <SymptomsScreen />;
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Medicines') {
            iconName = 'pill';
          } else if (route.name === 'Exercises') {
            iconName = 'run';
          } else if (route.name === 'What to Eat') {
            iconName = 'food-apple';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Medicines" component={MedicinesScreen} />
      <Tab.Screen name="Exercises" component={ExercisesScreen} />
      <Tab.Screen name="What to Eat" component={FoodsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  scrollContainer: { padding: 20, marginTop: 50, alignItems: 'center' },
  title: { fontSize: 18, marginBottom: 10 },
  subtitle: { fontSize: 16, marginTop: 20, marginBottom: 10 },
  response: { marginTop: 10, fontSize: 16 },
  button: {
    width: '90%', // Set a fixed width for all buttons
    padding: 15,
    borderRadius: 5,
    marginVertical: 10, // Add spacing between buttons
    alignItems: 'center',
    justifyContent: 'center', // Center the text inside the button
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});