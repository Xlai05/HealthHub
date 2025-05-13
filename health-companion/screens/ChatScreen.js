import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView } from 'react-native';

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('Try using paracetamol for mild headache. Stay hydrated!');

  const handleCheck = () => {
    // This will be replaced by real API call later
    setResponse(`You said: ${input}. (Here would be an OTC suggestion.)`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your symptom:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., runny nose"
        value={input}
        onChangeText={setInput}
      />
      <Button title="Check" onPress={handleCheck} />
      <ScrollView style={styles.response}>
        <Text>{response}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, marginBottom: 10 },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  response: {
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 5,
  },
});
