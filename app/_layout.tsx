// app/_layout.tsx
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoadingScreen from '../components/common/LoadingScreen';
import BottomTabs from '../components/navigation/BottomTabs';
import { SPLASH_SCREEN_DURATION } from '../constants/config';
import { AuthProvider, useAuth } from '../utils/AuthProvider';

// Auth Stack for Login/Signup
const AuthStack = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="auth/login" />
    <Stack.Screen name="auth/signup" />
  </Stack>
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

  if (showSplash || isLoading) {
    return <LoadingScreen />;
  }

  return isLoggedIn ? <BottomTabs /> : <AuthStack />;
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootLayoutNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}