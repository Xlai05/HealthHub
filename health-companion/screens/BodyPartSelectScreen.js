import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, Linking } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CheckBox } from 'react-native-elements'; // Import CheckBox

const Tab = createBottomTabNavigator();
const IPADRESS = '192.168.1.145'

const SymptomsScreen = ({
  symptoms,
  selectedSymptoms,
  selectMany,
  handleSymptomCheckbox,
  handleSymptomSelect,
  aiLoading,
  aiResponse,
  setAiLoading,
  setAiResponse,
  setModalVisible,
  IPADRESS,
}) => (
  <View style={{ flex: 1 }}>
    <ScrollView
      contentContainerStyle={[styles.scrollContainer, { paddingTop: 60 }]}
      keyboardShouldPersistTaps="handled"
    >
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
                justifyContent: 'flex-start',
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
            const prompt = `List possible sicknesses for these symptoms joined and separated: ${selectedSymptoms.join(', ')}.
            Format your response with clear bullet points for each sickness. For each, briefly list:
            - OTC medicines/remedies
            - Exercises
            - Food suggestions
            Keep it concise and easy to read.
            
            `;
            try {
              const response = await fetch(`http://${IPADRESS}:3000/ask-gemini`, {
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
          <Text style={styles.buttonText}>{aiLoading ? 'Asking AI...' : 'Ask AI'}</Text>
        </TouchableOpacity>
      )}

      {selectMany && aiResponse && !aiLoading && (
        <View style={{ marginTop: 20, backgroundColor: '#e3f2fd', padding: 12, borderRadius: 8 }}>
          <Text style={{ color: '#222', fontSize: 16 }}>{aiResponse}</Text>
        </View>
      )}
    </ScrollView>
  </View>
);

const MedicinesScreen = ({ otcMedicines }) => (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.subtitle}>OTC Medicines</Text>
    {otcMedicines.length === 0 ? (
      <Text>No medicines found for this symptom.</Text>
    ) : (
      otcMedicines.map((med, idx) => (
        <View key={idx} style={{ marginBottom: 12 }}>
          <Text style={{ fontWeight: 'bold' }}>{med.medicine_name || med.name || med}</Text>
          {med.description && <Text>{med.description}</Text>}
        </View>
      ))
    )}
  </ScrollView>
);

const ExercisesScreen = ({ exercises }) => (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.subtitle}>Exercises</Text>
    {exercises.length === 0 ? (
      <Text>No exercises found for this symptom.</Text>
    ) : (
      exercises.map((ex, idx) => (
        <View key={idx} style={{ marginBottom: 12 }}>
          <Text>{ex}</Text>
        </View>
      ))
    )}
  </ScrollView>
);

const FoodsScreen = ({ foods }) => (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.subtitle}>Food Suggestions</Text>
    {foods.length === 0 ? (
      <Text>No food suggestions found for this symptom.</Text>
    ) : (
      foods.map((food, idx) => (
        <View key={idx} style={{ marginBottom: 12 }}>
          <Text>{food}</Text>
        </View>
      ))
    )}
  </ScrollView>
);

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
    setAiResponse('');
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
    } else if (selectedRegion) {
      setSelectedRegion('');
      setBodyParts([]);
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

  let mainContent = null;

  // Example for region selection
  if (!selectedBodyPart) {
    if (!selectedRegion) {
      mainContent = (
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingTop: 0 }]}>
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
                <Text style={styles.regionLabel}>Upper Body</Text>
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
                <Text style={styles.regionLabel}>Lower Body</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );
    } else {
      mainContent = (
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingTop: 0 }]}>
            {bodyParts.map((part) => (
              <TouchableOpacity
                key={part.body_part}
                style={[styles.button, { backgroundColor: '#4CAF50' }]}
                onPress={() => handleBodyPartSelect(part.body_part)}
              >
                <Text style={styles.buttonText}>{part.body_part}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      );
    }
  } else if (!selectedSymptom) {
    mainContent = (
      <View style={{ flex: 1 }}>
        <SymptomsScreen
          symptoms={symptoms}
          selectedSymptoms={selectedSymptoms}
          selectMany={selectMany}
          handleSymptomCheckbox={handleSymptomCheckbox}
          handleSymptomSelect={handleSymptomSelect}
          aiLoading={aiLoading}
          aiResponse={aiResponse}
          setAiLoading={setAiLoading}
          setAiResponse={setAiResponse}
          setModalVisible={setModalVisible}
          IPADRESS={IPADRESS}
        />
      </View>
    );
  } else {
    mainContent = (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Medicines') iconName = 'pill';
            else if (route.name === 'Exercises') iconName = 'run';
            else if (route.name === 'What to Eat') iconName = 'food-apple';
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen
          name="Medicines"
          options={{ headerTitleAlign: 'center' }}
        >
          {() => <MedicinesScreen otcMedicines={otcMedicines} />}
        </Tab.Screen>
        <Tab.Screen
          name="Exercises"
          options={{ headerTitleAlign: 'center' }}
        >
          {() => <ExercisesScreen exercises={exercises} />}
        </Tab.Screen>
        <Tab.Screen
          name="What to Eat"
          options={{ headerTitleAlign: 'center' }}
        >
          {() => <FoodsScreen foods={foods} />}
        </Tab.Screen>
      </Tab.Navigator>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Only show Back button if not on the very first screen */}
      {(selectedRegion || selectedBodyPart || selectedSymptom) && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 40,
            left: 16,
            zIndex: 10,
            backgroundColor: '#f44336',
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 5,
          }}
          onPress={handleBack}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Back</Text>
        </TouchableOpacity>
      )}

      {/* Select button (top right, only on SymptomsScreen) */}
      {(!selectedSymptom && selectedBodyPart) && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 40,
            right: 16,
            zIndex: 10,
            backgroundColor: selectMany ? '#2196F3' : 'transparent',
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 5,
          }}
          onPress={() => setSelectMany(!selectMany)}
          activeOpacity={0.7}
        >
          <Text style={{
            color: selectMany ? 'white' : '#2196F3',
            fontSize: 16,
            fontWeight: 'bold'
          }}>
            Select
          </Text>
        </TouchableOpacity>
      )}

      {/* Title always at the top */}
      {(!selectedSymptom) && (
        <Text style={styles.title}>
          {!selectedRegion
            ? 'Select a body region:'
            : !selectedBodyPart
            ? 'Select a body part:'
            : `Select a symptom for ${selectedBodyPart}:`
          }
        </Text>
      )}

      {/* Main content */}
      {mainContent}

      {/* Disclaimer: only show on body region select */}
      {!selectedRegion && (
        <Text style={styles.disclaimer}>
          Disclaimer: All recommendations provided by this app are for informational purposes only. If your concern is not covered or symptoms persist, please seek medical advice from a healthcare professional.
        </Text>
      )}

      <TouchableOpacity
        onPress={() => Linking.openURL('https://www.accessdata.fda.gov/drugsatfda_docs/omuf/OTC%20Monograph_M005-Topical%20Antifungal%20drug%20products%20for%20OTC%20Human%20Use%2012.16.2021.pdf?utm_source')}
        style={{ alignSelf: 'center', marginBottom: 16 }}
      >
        <Text style={{ color: '#2196F3', textAlign: 'center', textDecorationLine: 'underline', fontSize: 12 }}>
          Data Source: FDA OTC Monograph
        </Text>
      </TouchableOpacity>
    </View>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 16,
    backgroundColor: '#f5f5f5',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 0,
    paddingTop: 90, // Increased to clear the Back button
    position: 'relative',
    zIndex: 5,
  },
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
  disclaimer: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
});