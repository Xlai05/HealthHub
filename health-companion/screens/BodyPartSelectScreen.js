import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BodyPartButton from '../components/BodyPartButton';

const bodyParts = [
  { name: 'Head', medication: 'Consider taking acetaminophen or ibuprofen.' },
  { name: 'Stomach', medication: 'Try an antacid or simethicone.' },
  { name: 'Back', medication: 'Over-the-counter pain relievers like naproxen may help.' },
  { name: 'Throat', medication: 'Gargle with warm salt water or consider throat lozenges.' },
  { name: 'Nose', medication: 'An OTC antihistamine may relieve symptoms.' },
];

export default function BodyPartSelectorScreen() {
  const [selectedMedication, setSelectedMedication] = useState('');

  const handleBodyPartSelect = (medication) => {
    setSelectedMedication(medication);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a body part to indicate your pain:</Text>
      {bodyParts.map((part) => (
        <BodyPartButton
          key={part.name}
          bodyPart={part.name}
          onSelect={() => handleBodyPartSelect(part.medication)}
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