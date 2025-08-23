import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  const validateEmail = async () => {
    console.log('Login: Validating email:', email);
    const emailRegex = /.+@.+\..+/;
    if (!email) {
      setEmailError('Please enter Email.');
      console.log('Login: Email validation failed: Empty email');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email.');
      console.log('Login: Email validation failed: Invalid format');
      return false;
    }
    try {
      const user = await AsyncStorage.getItem('user');
      console.log('Login: User from AsyncStorage:', user);
      if (!user || JSON.parse(user).email !== email) {
        setEmailError('This email is not registered.');
        console.log('Login: Email validation failed: Unregistered email');
        return false;
      }
      setEmailError('');
      console.log('Login: Email validation passed');
      return true;
    } catch (e) {
      console.warn('Login: Error checking email:', e);
      setEmailError('Error checking email.');
      return false;
    }
  };

  const validatePassword = async () => {
    console.log('Login: Validating password for email:', email);
    if (!password) {
      setPasswordError('Please enter a password.');
      console.log('Login: Password validation failed: Empty password');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      console.log('Login: Password validation failed: Too short');
      return false;
    }
    try {
      const user = await AsyncStorage.getItem('user');
      console.log('Login: User from AsyncStorage:', user);
      if (!user || JSON.parse(user).email !== email) {
        console.log('Login: User not found for email:', email);
        return false; // Email validation handles this
      }
      if (JSON.parse(user).password !== password) {
        setPasswordError('Wrong password.');
        console.log('Login: Password validation failed: Wrong password');
        return false;
      }
      setPasswordError('');
      console.log('Login: Password validation passed');
      return true;
    } catch (e) {
      console.warn('Login: Error checking password:', e);
      setPasswordError('Error checking password.');
      return false;
    }
  };

  const handleLogin = async () => {
    console.log('Login: handleLogin triggered');
    const isEmailValid = await validateEmail();
    const isPasswordValid = await validatePassword();
    if (!isEmailValid || !isPasswordValid) {
      console.log('Login: Validation failed, not navigating');
      Alert.alert('Error', 'Please enter the correct email and password.');
      return;
    }
    try {
      await AsyncStorage.removeItem('resetEmail');
      console.log('Login: resetEmail cleared');
      Alert.alert('Success', 'Login successful!');
      console.log('Login: Navigating to /');
      router.push('/');
    } catch (e) {
      console.warn('Login: Error during login:', e);
      Alert.alert('Error', 'Failed to log in. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    console.log('Login: Navigating to /auth/forgot-password');
    router.push('/auth/forgot-password');
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>LOGIN TO MEDSCAN</Text>
        <TextInput
          style={[styles.input, emailError ? styles.errorInput : null]}
          placeholder="Enter Email (@gmail.com)"
          placeholderTextColor="#888"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError('');
          }}
          onBlur={validateEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {emailError ? <Text style={[styles.errorText, { alignSelf: 'center' }]}>{emailError}</Text> : null}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput, passwordError ? styles.errorInput : null]}
            placeholder="Enter Password (min 8 characters)"
            placeholderTextColor="#888"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError('');
            }}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Feather name={showPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={[styles.errorText, { alignSelf: 'center' }]}>{passwordError}</Text> : null}
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={[styles.forgotPasswordText, { alignSelf: 'center' }]}>Forgot Password?</Text>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    width: 300,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    color: '#000',
    width: 300,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: 300,
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
  errorInput: {
    borderColor: '#ff0000',
  },
  errorText: {
    fontSize: 14,
    color: '#ff0000',
    marginBottom: 10,
    width: 300,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#202967',
    textAlign: 'center',
    marginBottom: 20,
    width: 300,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    width: 300,
  },
  button: {
    backgroundColor: '#202967',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});