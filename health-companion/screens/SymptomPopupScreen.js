import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function SymptomPopupScreen({ visible, onClose, aiResponse, aiLoading }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>Possible Sickness</Text>
          <ScrollView style={{ maxHeight: 300 }}>
            <Text style={styles.response}>
              {aiLoading
                ? 'Loading...'
                : aiResponse || 'No response from Gemini AI.'}
            </Text>
          </ScrollView>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#2196F3', marginTop: 20 }]}
            onPress={onClose}
            disabled={aiLoading}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  popup: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '85%',
    alignItems: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  response: {
    color: '#222',
    fontSize: 16
  },
  button: {
    width: '90%',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});

