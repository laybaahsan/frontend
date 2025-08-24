import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import server from '../../config/server';

export default function ResetPasswordScreen({ route }) {
  const router = useRouter();

  const { email } = route.params;
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

 const [userData, setUserData] = useState(null);

  const handleResetPassword = async () => {
    // Validation
    if (!resetCode || !newPassword || !confirmPassword) {
      return Alert.alert('Error', 'All fields are required');
    }
    if (newPassword.length < 8) {
      return Alert.alert('Error', 'Password must be at least 8 characters long');
    }
    if (newPassword !== confirmPassword) {
      return Alert.alert('Error', 'Passwords do not match');
    }

    try {
      const response = await axios.post(`${server}/forgetPassword/verify-reset`, {
        email,
        resetCode,
        newPassword,
      });

      Alert.alert('Success', response.data.message);
      // 2️⃣ Fetch updated user profile
      const userResponse = await axios.get(`${server}/user/profile`, {
        params: { email }, // assuming backend can fetch user by email
      });
      console.log('Fetched user data:', userResponse.data);
      setUserData(userResponse.data); // save in state

      
      router.push('/user/login');
    } catch (err) {
      console.error('Reset Password Error:', err.response?.data || err.message);
      Alert.alert('Error', err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>RESET PASSWORD</Text>

      <TextInput
        style={styles.input}
        placeholder="Reset Code"
        keyboardType="numeric"
        value={resetCode}
        onChangeText={setResetCode}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry={!showNewPassword}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
          <Feather name={showNewPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
          <Feather name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, width: '100%', marginBottom: 10 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 10 },
  eyeIcon: { position: 'absolute', right: 10 },
  button: { backgroundColor: '#003087', padding: 12, borderRadius: 5, width: '100%', marginTop: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontSize: 16 },
});