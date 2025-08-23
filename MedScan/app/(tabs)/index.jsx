import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [search, setSearch] = useState('');

  const handleSearch = () => {
    if (search.trim()) {
      router.push({ pathname: '/medicine-detail', params: { medicineName: search } });
    }
  };

  // 🚀 Navigate to OCR Camera screen
  const handleCamera = () => {
    router.push('/ocrCamera');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Search Medicine</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter medicine name"
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Feather name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.cameraButton} onPress={handleCamera}>
        <Feather name="camera" size={24} color="#fff" />
        <Text style={styles.cameraText}>Scan Medicine</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 20, color: '#000', fontWeight: 'bold', marginBottom: 20 },
  searchContainer: { flexDirection: 'row', marginBottom: 20 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#000',
  },
  searchButton: {
    backgroundColor: '#003087',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  cameraButton: {
    flexDirection: 'row',
    backgroundColor: '#003087',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cameraText: { color: '#fff', fontSize: 16, marginLeft: 10 },
});
