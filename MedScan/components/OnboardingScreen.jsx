import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

const OnboardingScreen = ({ image, text, isFirst, isLast, backRoute, nextRoute, skipRoute }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => router.push(skipRoute)}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>
      <Image source={image} style={styles.image} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.buttonContainer}>
        {!isFirst && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push(backRoute)}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push(nextRoute)}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', alignItems: 'center', padding: 20 },
  skipButton: { position: 'absolute', top: 40, right: 20 },
  skipText: { fontSize: 16, color: '#000' },
  image: { width: 100, height: 100, marginTop: 100 },
  text: { fontSize: 18, color: '#000', textAlign: 'center', marginTop: 20 },
  buttonContainer: { flexDirection: 'row', marginTop: 50 },
  button: {
    backgroundColor: '#003087',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: { color: '#fff', fontSize: 16 },
});

export default OnboardingScreen;