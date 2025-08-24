import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRouter } from 'expo-router';
import axios from 'axios';
import server from '../../config/server';

export default function LoginScreen() {
   const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Auto-fill email from AsyncStorage if available
  useEffect(() => {
    async function loadUserData() {
      try {
        const resetEmail = await AsyncStorage.getItem('resetEmail');
        console.log('Login: resetEmail from AsyncStorage:', resetEmail);
        if (resetEmail) {
          setEmail(resetEmail);
        }
      } catch (e) {
        console.warn('Login: Error loading resetEmail:', e);
      }
    }
    loadUserData();
  }, []);


  
  const handleLogin = async () => {
    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    if (!email) {
      setEmailError('Please enter your email.');
      return;
    }
    if (!password) {
      setPasswordError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${server}/user/login`, { email, password });

      const { token, user } = response.data;

      // 2️⃣ Store token and basic user info
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      // 3️⃣ Fetch additional user data (e.g., search history)
      const userDataResponse = await axios.get(`${server}/user/profile`, {
        params: { email },
        headers: { Authorization: `Bearer ${token}` },
      });

      const additionalData = userDataResponse.data;
      console.log('Fetched additional user data:', additionalData);

      // 4️⃣ Store additional data
      await AsyncStorage.setItem('userAdditionalData', JSON.stringify(additionalData));

      // 5️⃣ Clear resetEmail if any
      await AsyncStorage.removeItem('resetEmail');

      Alert.alert('Success', 'Login successful!');
      router.push('/'); // Navigate to home
    } catch (err) {
      console.log('Login error:', err.response?.data || err.message);

      if (err.response?.data?.error) {
        const backendError = err.response.data.error;
        if (backendError.toLowerCase().includes('email')) setEmailError(backendError);
        else if (backendError.toLowerCase().includes('password') || backendError.toLowerCase().includes('credentials')) 
          setPasswordError(backendError);
        else Alert.alert('Error', backendError);
      } else {
        Alert.alert('Error', 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgetPassword/forgot-password');
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>LOGIN TO MEDSCAN</Text>

        <TextInput
          style={[styles.input, emailError ? styles.errorInput : null]}
          placeholder="Enter Email"
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

        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput, passwordError ? styles.errorInput : null]}
            placeholder="Enter Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError('');
            }}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
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
  passwordContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, width: 300 },
  passwordInput: { flex: 1 },
  eyeIcon: { position: 'absolute', right: 10 },
  errorInput: { borderColor: '#ff0000' },
  errorText: { fontSize: 14, color: '#ff0000', marginBottom: 10 },
  forgotPasswordText: { fontSize: 14, color: '#202967', textAlign: 'center', marginBottom: 20 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'center', width: 300 },
  button: { backgroundColor: '#202967', padding: 10, borderRadius: 5, flex: 1, marginHorizontal: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
});