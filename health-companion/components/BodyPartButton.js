import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function BodyPartButton({ bodyPart, onSelect }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onSelect}>
      <Text style={styles.text}>{bodyPart}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});