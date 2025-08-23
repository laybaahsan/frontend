import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function VerifyCodeScreen() {
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');

  const validateCode = async () => {
    console.log('VerifyCode: Validating code:', code);
    if (!code) {
      setCodeError('Please enter the verification code.');
      console.log('VerifyCode: Code validation failed: Empty code');
      return false;
    }
    try {
      const resetData = await AsyncStorage.getItem('resetCode');
      console.log('VerifyCode: resetCode from AsyncStorage:', resetData);
      if (!resetData) {
        setCodeError('No verification code found. Please request a new code.');
        console.log('VerifyCode: Code validation failed: No resetCode');
        return false;
      }
      const parsedData = JSON.parse(resetData);
      if (parsedData.code !== code) {
        setCodeError('Invalid verification code.');
        console.log('VerifyCode: Code validation failed: Invalid code');
        return false;
      }
      setCodeError('');
      console.log('VerifyCode: Code validation passed');
      return true;
    } catch (e) {
      console.warn('VerifyCode: Error checking code:', e);
      setCodeError('Error verifying code.');
      return false;
    }
  };

  const handleVerifyCode = async () => {
    console.log('VerifyCode: handleVerifyCode triggered');
    const isValid = await validateCode();
    if (!isValid) {
      console.log('VerifyCode: Validation failed, not navigating');
      Alert.alert('Error', 'Please enter a valid verification code.');
      return;
    }
    try {
      console.log('VerifyCode: Navigating to /auth/reset-password');
      router.push('/auth/reset-password');
    } catch (e) {
      console.warn('VerifyCode: Error during verification:', e);
      Alert.alert('Error', 'Failed to verify code. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>VERIFY CODE</Text>
        <TextInput
          style={[styles.input, codeError ? styles.errorInput : null]}
          placeholder="Enter Verification Code"
          placeholderTextColor="#888"
          value={code}
          onChangeText={(text) => {
            setCode(text);
            setCodeError('');
          }}
          keyboardType="numeric"
        />
        {codeError ? <Text style={[styles.errorText, { alignSelf: 'center' }]}>{codeError}</Text> : null}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
            <Text style={styles.buttonText}>Verify</Text>
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