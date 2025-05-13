// screens/ChatScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function ChatScreen() {
  const [symptom, setSymptom] = useState('');
  const [response, setResponse] = useState('');

  const handleCheck = () => {
    if (symptom.toLowerCase().includes('runny nose')) {
      setResponse('Try an OTC antihistamine like loratadine or diphenhydramine.');
    } else {
      setResponse('Sorry, no suggestion for that symptom yet.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your symptom:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. runny nose"
        value={symptom}
        onChangeText={setSymptom}
      />
      <Button title="Check" onPress={handleCheck} />
      <Text style={styles.response}>{response}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  title: { fontSize: 18, marginBottom: 10 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  response: { marginTop: 20, fontSize: 16 }
});
