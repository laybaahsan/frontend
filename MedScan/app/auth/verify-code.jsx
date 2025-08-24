import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import axios from 'axios';
import server from '../../config/server'; // your backend URL



export default function ResetPasswordScreen({ route }) {
    const router = useRouter();

  const { email } = route.params; // email should be passed from previous screen
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [codeError, setCodeError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  // Validation
  const validateInputs = () => {
    let isValid = true;

    if (!code.trim()) {
      setCodeError('Please enter the verification code.');
      isValid = false;
    } else setCodeError('');

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      isValid = false;
    } else setPasswordError('');

    if (newPassword !== confirmPassword) {
      setConfirmError('Passwords do not match.');
      isValid = false;
    } else setConfirmError('');

    return isValid;
  };

  // Submit to backend
  const handleResetPassword = async () => {
    if (!validateInputs()) return;

    try {
      const response = await axios.post(`${server}/forgetPassword/verify-reset`, {
        email,
        code,
        newPassword,
        confirmPassword,
      });

      Alert.alert('Success', response.data.message);


 const profileResponse = await axios.get(`${server}/user/profile`, {
        params: { email },
      });

      const userData = profileResponse.data;
      console.log('Fetched user data:', userData);

      // 3️⃣ Store user info locally for offline use
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      router.push('/user/login');
    } catch (error) {
      console.log('Reset password error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Failed to reset password.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>RESET PASSWORD</Text>

        <TextInput
          style={[styles.input, codeError && styles.errorInput]}
          placeholder="Enter Verification Code"
          value={code}
          onChangeText={(text) => {
            setCode(text);
            setCodeError('');
          }}
          keyboardType="numeric"
        />
        {codeError && <Text style={styles.errorText}>{codeError}</Text>}

        <TextInput
          style={[styles.input, passwordError && styles.errorInput]}
          placeholder="New Password"
          value={newPassword}
          onChangeText={(text) => setNewPassword(text)}
          secureTextEntry={!showPassword}
        />
        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

        <TextInput
          style={[styles.input, confirmError && styles.errorInput]}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          secureTextEntry={!showPassword}
        />
        {confirmError && <Text style={styles.errorText}>{confirmError}</Text>}

        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={{ marginBottom: 10 }}
        >
          <Text style={{ color: '#003087', textAlign: 'center' }}>
            {showPassword ? 'Hide Passwords' : 'Show Passwords'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  formContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: 300,
    fontSize: 16,
  },
  errorInput: { borderColor: '#ff0000' },
  errorText: { color: '#ff0000', marginBottom: 10, width: 300 },
  button: {
    backgroundColor: '#003087',
    padding: 12,
    borderRadius: 5,
    width: 300,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
