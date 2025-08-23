import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import server from "../server";

const CustomDrawer = ({ isOpen, onClose, isSignedUp, setIsSignedUp }) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    setIsSignedUp(false);
    onClose();
    router.replace('/auth/signup');
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent>
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
        <Text style={styles.header}>Profile</Text>
        <Image
          source={require('../assets/profile.png')}
          style={styles.profileIcon}
        />
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              onClose();
              router.push('/auth/signup');
            }}
          >
            <Text style={styles.optionText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={handleLogout}>
            <Text style={styles.optionText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    width: '60%',
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  closeButton: { alignSelf: 'flex-end', padding: 10 },
  closeText: { fontSize: 16, color: '#000' },
  header: { fontSize: 20, color: '#000', fontWeight: 'bold', marginBottom: 20, alignSelf: 'center' },
  profileIcon: { width: 80, height: 80, alignSelf: 'center', marginBottom: 20 },
  Container: { flexDirection: 'colum', justifyContent: 'space-between' },
  option: { padding: 10 },
  optionText: { fontSize: 16, color: '#000' },
});

export default CustomDrawer;