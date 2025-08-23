import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = async () => {
    console.log('ForgotPassword: Validating email:', email);
    const emailRegex = /.+@.+\..+/;
    if (!email) {
      setEmailError('Please enter Email.');
      console.log('ForgotPassword: Email validation failed: Empty email');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email.');
      console.log('ForgotPassword: Email validation failed: Invalid format');
      return false;
    }
    try {
      const user = await AsyncStorage.getItem('user');
      console.log('ForgotPassword: User from AsyncStorage:', user);
      if (!user || JSON.parse(user).email !== email) {
        setEmailError('This email is not registered.');
        console.log('ForgotPassword: Email validation failed: Unregistered email');
        return false;
      }
      setEmailError('');
      console.log('ForgotPassword: Email validation passed');
      return true;
    } catch (e) {
      console.warn('ForgotPassword: Error checking email:', e);
      setEmailError('Error checking email.');
      return false;
    }
  };

  const handleSendCode = async () => {
    console.log('ForgotPassword: handleSendCode triggered');
    const isValid = await validateEmail();
    if (!isValid) {
      console.log('ForgotPassword: Validation failed, not navigating');
      Alert.alert('Error', 'Please enter a valid, registered email.');
      return;
    }
    try {
      const code = '123456'; // Mock code
      console.log('ForgotPassword: Generated mock code:', code);
      await AsyncStorage.setItem('resetCode', JSON.stringify({ email, code }));
      console.log('ForgotPassword: resetCode stored successfully');
      Alert.alert('Success', 'Verification code sent (use code: 123456).');
      console.log('ForgotPassword: Navigating to /auth/verify-code');
      router.push('/auth/verify-code');
    } catch (e) {
      console.warn('ForgotPassword: Error saving code:', e);
      Alert.alert('Error', 'Failed to send code. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>RESET PASSWORD</Text>
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
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSendCode}>
            <Text style={styles.buttonText}>Send Code</Text>
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
    justifyContent: 'center',
    marginBottom: 20,
    width: 300,
  },
  button: {
    backgroundColor: '#003087',
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