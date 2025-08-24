import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import axios from 'axios';
import server from '../../config/server'; // your backend base URL

export default function SignUpScreen(){
 const router = useRouter(); 

  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [FirstNameError, setFirstNameError] = useState('');
  const [LastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Validate email format
  const validateEmailFormat = (email) => {
    const emailRegex = /.+@.+\..+/;
    return emailRegex.test(email);
  };

  // Validate password length
  const validatePassword = (pass) => {
    if (pass.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Validate names & email
  const validateInputs = () => {
    let isValid = true;

    if (!FirstName.trim()) {
      setFirstNameError('Please enter First Name.');
      isValid = false;
    } else setFirstNameError('');

    if (!LastName.trim()) {
      setLastNameError('Please enter Last Name.');
      isValid = false;
    } else setLastNameError('');

    if (!email.trim()) {
      setEmailError('Please enter Email.');
      isValid = false;
    } else if (!validateEmailFormat(email)) {
      setEmailError('Please enter a valid email.');
      isValid = false;
    } else setEmailError('');

    if (!validatePassword(password)) isValid = false;

    return isValid;
  };

  // Signup handler with backend integration
  const handleSignUp = async () => {
    if (!validateInputs()) {
      Alert.alert('Error', 'Please fix the errors above.');
      return;
    }

    try {
      // Call backend API create user in backend
      const response = await axios.post(`${server}/user/signup`, {
        FirstName,
        LastName,
        email,
        password,
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Sign up successful! Please log in.');

        // 2️⃣ Fetch user data after signup
        const userDataResponse = await axios.get(`${server}/user/profile`, {
          params: { email }, // assuming backend can fetch user by email
        });

        console.log('Fetched user data:', userDataResponse.data);

        router.push('/user/login');
      }
    } catch (error) {
      console.log('Signup error:', error.response?.data || error.message);
      if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Failed to sign up. Try again later.');
      }
    }
  };

  // Skip signup
  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>CREATE MEDSCAN ACCOUNT</Text>

        <TextInput
          style={[styles.input, firstNameError && styles.errorInput]}
          placeholder="Enter First Name"
          value={firstName}
          onChangeText={(text) => {
            setFirstName(text);
            if (text) setFirstNameError('');
          }}
        />
        {firstNameError ? <Text style={styles.errorText}>{firstNameError}</Text> : null}

        <TextInput
          style={[styles.input, lastNameError && styles.errorInput]}
          placeholder="Enter Last Name"
          value={lastName}
          onChangeText={(text) => {
            setLastName(text);
            if (text) setLastNameError('');
          }}
        />
        {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}

        <TextInput
          style={[styles.input, emailError && styles.errorInput]}
          placeholder="Enter Email"
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
            style={[styles.input, styles.passwordInput, passwordError && styles.errorInput]}
            placeholder="Enter Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Feather name={showPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

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
  container: { flex: 1, backgroundColor: '#fff' },
  formContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10, width: 300 },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, width: 300 },
  passwordInput: { flex: 1 },
  eyeIcon: { position: 'absolute', right: 10 },
  errorInput: { borderColor: '#ff0000' },
  errorText: { color: '#ff0000', marginBottom: 10, width: 300 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, width: 300 },
  button: { backgroundColor: '#202967', padding: 10, borderRadius: 5, flex: 1, marginHorizontal: 5 },
  buttonText: { color: '#fff', textAlign: 'center' },
});
