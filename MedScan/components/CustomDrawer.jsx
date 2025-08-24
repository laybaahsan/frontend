import React, { useState, useEffect } from 'react';

import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import axios from 'axios';
import server from '../config/server';

const CustomDrawer = ({ isOpen, onClose, setIsSignedUp }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

   // Fetch user profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const storedUser = await AsyncStorage.getItem('user');
        if (!storedUser) return;
        const parsedUser = JSON.parse(storedUser);

        const res = await axios.get(`${server}/user/profile`, {
          headers: { Authorization: `Bearer ${parsedUser.token}` }, // if using JWT
          withCredentials: true,
        });
         setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
      if (isOpen) fetchProfile(); // fetch only when drawer opens
  }, [isOpen]);


  const handleLogout = async () => {
      try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);

        // Optional: call backend to logout
        await axios.post(`${server}/user/logout`, {}, {
          headers: { Authorization: `Bearer ${parsedUser.token}` },
          withCredentials: true,
        });
      }

      await AsyncStorage.removeItem('user');
      setIsSignedUp(false);
      onClose();
      router.replace('/auth/signup');
    } catch (err) {
      console.error('Logout failed:', err);
      Alert.alert('Error', 'Logout failed. Try again.');
    }
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
              router.push('/user/signup');
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
  optionsContainer: { flexDirection: 'column', justifyContent: 'space-between' },

  option: { padding: 10 },
  optionText: { fontSize: 16, color: '#000' },
});

export default CustomDrawer;