import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import axios from 'axios';
import server from '../../config/server';

export default function ForgotPasswordScreen() {
const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');
 const [loading, setLoading] = useState(false);


  // Local email format validation
  const validateEmail = () => {
    const emailRegex = /.+@.+\..+/;
    if (!email) {
      setEmailError('Please enter your email.');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email.');
      return false;
    }
    setEmailError('');
    return true;
  };

  // Send request to backend to generate code
  const handleSendCode = async () => {
    if (!validateEmail()) {
      Alert.alert('Error', 'Please enter a valid email.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${server}/forgetPassword/forget-password`, { email });
      // Backend should return { message: 'Verification code sent' }
      Alert.alert('Success', response.data.message || 'Verification code sent to your email.');
      router.push('/auth/verify-code');
    } catch (err) {
      console.log('ForgotPassword error:', err.response?.data || err.message);
      const backendError = err.response?.data?.error || 'Failed to send code. Try again.';
      Alert.alert('Error', backendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>RESET PASSWORD</Text>
        <TextInput
          style={[styles.input, emailError ? styles.errorInput : null]}
          placeholder="Enter your email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSendCode} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send Code</Text>}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  formContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { fontSize: 20, color: '#000', fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10, fontSize: 16, width: 300, color: '#000' },
  errorInput: { borderColor: '#ff0000' },
  errorText: { fontSize: 14, color: '#ff0000', marginBottom: 10, width: 300 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'center', width: 300 },
  button: { backgroundColor: '#003087', padding: 10, borderRadius: 5, flex: 1, marginHorizontal: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
});