import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import CustomDrawer from '../../components/CustomDrawer';

export default function TabsLayout() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#ccc',
          tabBarStyle: { backgroundColor: '#003087' },
          headerStyle: { backgroundColor: '#003087' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontSize: 20 },
          headerLeft: () => (
            <Feather
              name="menu"
              size={24}
              color="#fff"
              onPress={() => setIsDrawerOpen(true)}
              style={{ marginLeft: 10 }}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <Feather name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History',
            tabBarIcon: ({ color }) => (
              <Feather name="clock" size={24} color={color} />
            ),
          }}
          initialParams={{ isSignedUp }}
        />
      </Tabs>
      <CustomDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        isSignedUp={isSignedUp}
        setIsSignedUp={setIsSignedUp}
      />
    </>
  );
}