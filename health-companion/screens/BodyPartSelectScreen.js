import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BodyPartButton from '../components/BodyPartButton';

export default function BodyPartSelectorScreen() {
  const [bodyParts, setBodyParts] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState('');

  useEffect(() => {
    // Fetch data from the backend
    fetch('http://localhost:3000/symptom-recommendations')
      .then((response) => response.json())
      .then((data) => {
        const uniqueBodyParts = [...new Map(data.map(item => [item.body_part, item])).values()];
        setBodyParts(uniqueBodyParts);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleBodyPartSelect = (medication) => {
    setSelectedMedication(medication);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a body part to indicate your pain:</Text>
      {bodyParts.map((part) => (
        <BodyPartButton
          key={part.id}
          bodyPart={part.body_part}
          onSelect={() => handleBodyPartSelect(part.medicine_description)}
        />
      ))}
      {selectedMedication ? (
        <Text style={styles.response}>{selectedMedication}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  title: { fontSize: 18, marginBottom: 10 },
  response: { marginTop: 20, fontSize: 16 },
});