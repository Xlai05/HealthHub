import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BodyPartButton from '../components/BodyPartButton';
import { CheckBox } from 'react-native-elements'; // Import CheckBox
import SymptomPopupScreen from './SymptomPopupScreen';

const Tab = createBottomTabNavigator();
const IPADRESS = '192.168.1.145'

export default function BodyPartSelectorScreen() {
  const [bodyParts, setBodyParts] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [otcMedicines, setOtcMedicines] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [foods, setFoods] = useState([]);
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectMany, setSelectMany] = useState(false); // For multi-select
  const [selectedSymptoms, setSelectedSymptoms] = useState([]); // For storing selected symptoms
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`http://${IPADRESS}:3000/symptom-recommendations`)
      .then((response) => response.json())
      .then((data) => {
        const uniqueBodyParts = [...new Map(data.map(item => [item.body_part, item])).values()];
        setBodyParts(uniqueBodyParts);
        setLoading(false);
      })
      .catch((error) => {
        setError('Could not fetch body parts. Check your connection.');
        setLoading(false);
        console.error('Error fetching body parts:', error);
      });
  }, []);

  const handleBodyPartSelect = (bodyPart) => {
    setSelectedBodyPart(bodyPart);
    setSymptoms([]);
    setOtcMedicines([]);
    setExercises([]);
    setFoods([]);
    // setSelectedSymptoms([]); // <-- Do NOT clear here

    // Fetch symptoms for the selected body part
    fetch(`http://${IPADRESS}:3000/symptoms/${bodyPart}`)
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
    fetch(`http://${IPADRESS}:3000/otc-medicines/${symptom}`)
      .then((response) => response.json())
      .then((data) => setOtcMedicines(data))
      .catch((error) => console.error('Error fetching OTC medicines:', error));

    fetch(`http://${IPADRESS}:3000/exercises/${symptom}`)
      .then((response) => response.json())
      .then((data) => setExercises(data.map((item) => item.exercise)))
      .catch((error) => console.error('Error fetching exercises:', error));

    fetch(`http://${IPADRESS}:3000/foods/${symptom}`)
      .then((response) => response.json())
      .then((data) => setFoods(data.map((item) => item.food_suggestion)))
      .catch((error) => console.error('Error fetching foods:', error));
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setBodyParts([]); // Clear body parts before fetching

    // Fetch body parts for the selected region
    fetch(`http://${IPADRESS}:3000/body-parts/${region}`)
      .then((response) => response.json())
      .then((data) => setBodyParts(data))
      .catch((error) => console.error('Error fetching body parts:', error));
  };

  const handleBack = () => {
    if (selectedSymptom) {
      setSelectedSymptom('');
      setOtcMedicines([]);
      setExercises([]);
      setFoods([]);
      // Do NOT clear selectedSymptoms here
    } else if (selectedBodyPart) {
      setSelectedBodyPart('');
      setSymptoms([]);
      // setSelectedSymptoms([]); // <-- Remove or comment out this line
    }
  };

  // Multi-select symptom handler
  const handleSymptomCheckbox = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const SymptomsScreen = () => (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.subtitle}>Select a symptom for {selectedBodyPart}:</Text>
      {Array.isArray(symptoms) && symptoms.length > 0 ? (
        symptoms.map((symptom, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              {
                backgroundColor: selectedSymptoms.includes(symptom) ? '#388e3c' : '#4CAF50',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start', // Align content to the left
              }
            ]}
            onPress={() => {
              if (selectMany) {
                handleSymptomCheckbox(symptom);
              } else {
                handleSymptomSelect(symptom);
              }
            }}
          >
            {selectMany ? (
              <CheckBox
                checked={selectedSymptoms.includes(symptom)}
                onPress={() => handleSymptomCheckbox(symptom)}
                containerStyle={{
                  padding: 0,
                  marginRight: 8,
                  backgroundColor: 'transparent',
                  borderWidth: 0,
                }}
              />
            ) : null}
            <Text style={styles.buttonText}>{symptom.toString()}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No symptoms available for this body part.</Text>
      )}

      
      {selectMany && (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#2196F3' }]}
          onPress={async () => {
            setAiLoading(true);
            setAiResponse('');
            const prompt = `What sickness are possible if you have these symptoms: ${selectedSymptoms.join(', ')}?`;
            try {
              const response = await fetch('http://192.168.1.145:3000/ask-gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
              });
              const data = await response.json();
              setAiResponse(data.reply || 'No response from AI.');
              setModalVisible(true);
            } catch (e) {
              setAiResponse('Failed to contact Gemini AI.');
              setModalVisible(true);
            }
            setAiLoading(false);
          }}
          disabled={selectedSymptoms.length === 0 || aiLoading}
        >
          <Text style={styles.buttonText}>{aiLoading ? 'Asking Gemini AI...' : 'Ask Gemini AI'}</Text>
        </TouchableOpacity>
      )}

      
      {selectMany && aiResponse && !aiLoading && (
        <View style={{ marginTop: 20, backgroundColor: '#e3f2fd', padding: 12, borderRadius: 8 }}>
          <Text style={{ color: '#222', fontSize: 16 }}>{aiResponse}</Text>
        </View>
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
    if (!selectedRegion) {
      return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Select Many Button */}
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: selectMany ? '#4CAF50' : '#f44336',
                marginBottom: 10,
                width: '90%',
              }
            ]}
            onPress={() => setSelectMany(!selectMany)}
          >
            <Text style={styles.buttonText}>
              {'Select Many'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.title}>Select a body region:</Text>
          <View style={{ flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => handleRegionSelect('upper')}
            >
              <Image
                source={require('../assets/upper_body.png')}
                style={styles.bodyImage}
                resizeMode="contain"
              />
              <Text style={styles.regionLabel}>Upper Extremities</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => handleRegionSelect('lower')}
            >
              <Image
                source={require('../assets/lower_body.png')}
                style={styles.bodyImage}
                resizeMode="contain"
              />
              <Text style={styles.regionLabel}>Lower Extremities</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    } else {
      return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Select a body part:</Text>
          {bodyParts.map((part) => (
            <TouchableOpacity
              key={part.body_part}
              style={[styles.button, { backgroundColor: '#4CAF50' }]}
              onPress={() => handleBodyPartSelect(part.body_part)}
            >
              <Text style={styles.buttonText}>{part.body_part}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#f44336' }]}
            onPress={() => setSelectedRegion('')}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }
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
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: { fontSize: 18, marginBottom: 10 },
  subtitle: { fontSize: 16, marginTop: 20, marginBottom: 10 },
  response: { marginTop: 10, fontSize: 16 },
  button: {
    width: '90%',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  imageButton: {
    alignItems: 'center',
    margin: 10,
  },
  bodyImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  regionLabel: {
    color: '#222',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
});