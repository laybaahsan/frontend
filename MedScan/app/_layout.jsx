import React, { useState, useEffect } from 'react';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isSignedUp, setIsSignedUp] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 5000));
        const user = await AsyncStorage.getItem('user');
        if (user) {
          setIsSignedUp(true);
        } else {
          router.replace('/onboarding/screen1');
        }
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} initialParams={{ isSignedUp, setIsSignedUp }} />
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen
        name="medicine-detail"
        options={{
          headerStyle: { backgroundColor: '#003087' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontSize: 20 },
        }}
      />
    </Stack>
  );
}