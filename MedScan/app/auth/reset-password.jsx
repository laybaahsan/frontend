import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validatePasswords = () => {
    console.log('ResetPassword: Validating passwords:', { newPassword, confirmPassword });
    let isValid = true;
    if (!newPassword) {
      setNewPasswordError('Please enter a new password.');
      console.log('ResetPassword: Password validation failed: Empty new password');
      isValid = false;
    } else if (newPassword.length < 8) {
      setNewPasswordError('Password must be at least 8 characters long.');
      console.log('ResetPassword: Password validation failed: New password too short');
      isValid = false;
    } else {
      setNewPasswordError('');
    }
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password.');
      console.log('ResetPassword: Password validation failed: Empty confirm password');
      isValid = false;
    } else if (confirmPassword !== newPassword) {
      setConfirmPasswordError('Passwords do not match.');
      console.log('ResetPassword: Password validation failed: Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    return isValid;
  };

  const handleResetPassword = async () => {
    console.log('ResetPassword: handleResetPassword triggered');
    const isValid = validatePasswords();
    if (!isValid) {
      console.log('ResetPassword: Validation failed, not navigating');
      Alert.alert('Error', 'Please fill in all required fields correctly.');
      return;
    }
    try {
      const resetData = await AsyncStorage.getItem('resetCode');
      console.log('ResetPassword: resetCode from AsyncStorage:', resetData);
      if (!resetData) {
        Alert.alert('Error', 'No verification data found. Please request a new code.');
        console.log('ResetPassword: No resetCode found');
        return;
      }
      const { email } = JSON.parse(resetData);
      const user = await AsyncStorage.getItem('user');
      console.log('ResetPassword: User from AsyncStorage:', user);
      if (!user || JSON.parse(user).email !== email) {
        Alert.alert('Error', 'User not found. Please sign up first.');
        console.log('ResetPassword: User not found for email:', email);
        return;
      }
      const updatedUser = { ...JSON.parse(user), password: newPassword };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      await AsyncStorage.setItem('resetEmail', email);
      await AsyncStorage.removeItem('resetCode');
      Alert.alert('Success', 'Password reset successful! Please log in with your new password.');
      console.log('ResetPassword: Navigating to /auth/login');
      router.push('/auth/login');
    } catch (e) {
      console.warn('ResetPassword: Error resetting password:', e);
      Alert.alert('Error', 'Failed to reset password. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>SET NEW PASSWORD</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput, newPasswordError ? styles.errorInput : null]}
            placeholder="Enter New Password (min 8 characters)"
            placeholderTextColor="#888"
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              setNewPasswordError('');
            }}
            secureTextEntry={!showNewPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowNewPassword(!showNewPassword)}
          >
            <Feather name={showNewPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
          </TouchableOpacity>
        </View>
        {newPasswordError ? <Text style={[styles.errorText, { alignSelf: 'center' }]}>{newPasswordError}</Text> : null}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput, confirmPasswordError ? styles.errorInput : null]}
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setConfirmPasswordError('');
            }}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Feather name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
          </TouchableOpacity>
        </View>
        {confirmPasswordError ? <Text style={[styles.errorText, { alignSelf: 'center' }]}>{confirmPasswordError}</Text> : null}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
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