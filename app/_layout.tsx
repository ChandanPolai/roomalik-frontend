// app/_layout.tsx
import React, { useEffect, useState } from 'react';
import { Stack, Tabs } from 'expo-router';
import { AuthProvider, useAuth } from '../utils/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import LoadingScreen from '../components/common/LoadingScreen';
import { SPLASH_SCREEN_DURATION } from '../constants/config';

// Auth Stack for Login/Signup
const AuthStack = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="auth/login" />
    <Stack.Screen name="auth/signup" />
  </Stack>
);

// Main Tabs for authenticated users
const MainTabs = () => (
  <Tabs
    screenOptions={{
      tabBarActiveTintColor: '#3B82F6',
      tabBarInactiveTintColor: '#9CA3AF',
      tabBarStyle: {
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
      },
      headerShown: true,
      headerStyle: {
        backgroundColor: '#3B82F6',
      },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Tabs.Screen
      name="(tabs)/index"
      options={{
        title: 'Home',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home" size={size} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="rooms"
      options={{
        title: 'Rooms',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="bed" size={size} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="payment"
      options={{
        title: 'Payment',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="wallet" size={size} color={color} />
        ),
      }}
    />
    <Tabs.Screen
      name="tenants"
      options={{
        title: 'Tenants',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="people" size={size} color={color} />
        ),
      }}
    />
  </Tabs>
);

// Root Layout Navigator
const RootLayoutNavigator = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, SPLASH_SCREEN_DURATION);

    return () => clearTimeout(timer);
  }, []);

  // Show splash screen
  if (showSplash || isLoading) {
    return <LoadingScreen />;
  }

  // Show Auth Stack or Main Tabs based on login status
  return isLoggedIn ? <MainTabs /> : <AuthStack />;
};

// Root Export with AuthProvider
export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNavigator />
    </AuthProvider>
  );
}