import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function SignUpScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Auto-fill fields from AsyncStorage for regular sign-up
  useEffect(() => {
    async function loadUserData() {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          const parsedUser = JSON.parse(user);
          setFirstName(parsedUser.firstName || '');
          setLastName(parsedUser.lastName || '');
          setEmail(parsedUser.email || '');
          setPassword(parsedUser.password || '');
          console.log('SignUp: Loaded user data:', parsedUser);
        }
      } catch (e) {
        console.warn('SignUp: Error loading user data:', e);
      }
    }
    loadUserData();
  }, []);

  const validateEmail = async () => {
    console.log('SignUp: Validating email:', email);
    const emailRegex = /.+@.+\..+/;
    if (!email) {
      setEmailError('Please enter Email.');
      console.log('SignUp: Email validation failed: Empty email');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email.');
      console.log('SignUp: Email validation failed: Invalid format');
      return false;
    }
    try {
      const user = await AsyncStorage.getItem('user');
      if (user && JSON.parse(user).email === email) {
        setEmailError('This email is already registered.');
        console.log('SignUp: Email validation failed: Email already exists');
        return false;
      }
      setEmailError('');
      console.log('SignUp: Email validation passed');
      return true;
    } catch (e) {
      console.warn('SignUp: Error checking email:', e);
      setEmailError('Error checking email.');
      return false;
    }
  };

  const validatePassword = (pass) => {
    console.log('SignUp: Validating password');
    if (pass.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      console.log('SignUp: Password validation failed: Too short');
      return false;
    }
    setPasswordError('');
    console.log('SignUp: Password validation passed');
    return true;
  };

  const validateNamesAndEmail = async () => {
    console.log('SignUp: Validating inputs');
    let isValid = true;
    if (!firstName) {
      setFirstNameError('Please enter First Name.');
      console.log('SignUp: First name validation failed: Empty');
      isValid = false;
    } else {
      setFirstNameError('');
    }
    if (!lastName) {
      setLastNameError('Please enter Last Name.');
      console.log('SignUp: Last name validation failed: Empty');
      isValid = false;
    } else {
      setLastNameError('');
    }
    if (!await validateEmail()) {
      isValid = false;
    }
    return isValid;
  };

  const handleSignUp = async () => {
    console.log('SignUp: handleSignUp triggered');
    const isValid = await validateNamesAndEmail();
    if (!isValid) {
      console.log('SignUp: Validation failed, not signing up');
      Alert.alert('Error', 'Please fill in all required fields correctly.');
      return;
    }
    if (!validatePassword(password)) {
      return;
    }
    try {
      const user = { email, firstName, lastName, password };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('hasSeenOnboarding', 'true'); // Set onboarding flag
      console.log('SignUp: User registered:', user);
      Alert.alert('Success', 'Sign up successful! Please log in.');
      console.log('SignUp: Navigating to /auth/login');
      router.push('/auth/login');
    } catch (e) {
      console.warn('SignUp: Error saving user:', e);
      Alert.alert('Error', 'Failed to sign up. Please try again.');
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true'); // Set onboarding flag
      console.log('SignUp: Skipped signup, navigating to /(tabs)');
      router.replace('/(tabs)');
    } catch (e) {
      console.warn('SignUp: Error on skip:', e);
      router.replace('/(tabs)'); // Fallback
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>CREATE MEDSCAN ACCOUNT</Text>
        <TextInput
          style={[styles.input, firstNameError ? styles.errorInput : null]}
          placeholder="Enter First Name (required)"
          placeholderTextColor="#888"
          value={firstName}
          onChangeText={(text) => {
            setFirstName(text);
            if (text) setFirstNameError('');
          }}
        />
        {firstNameError ? <Text style={[styles.errorText, { alignSelf: 'center' }]}>{firstNameError}</Text> : null}
        <TextInput
          style={[styles.input, lastNameError ? styles.errorInput : null]}
          placeholder="Enter Last Name (required)"
          placeholderTextColor="#888"
          value={lastName}
          onChangeText={(text) => {
            setLastName(text);
            if (text) setLastNameError('');
          }}
        />
        {lastNameError ? <Text style={[styles.errorText, { alignSelf: 'center' }]}>{lastNameError}</Text> : null}
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
              validatePassword(text);
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSkip}>
            <Text style={styles.buttonText}>Skip</Text>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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