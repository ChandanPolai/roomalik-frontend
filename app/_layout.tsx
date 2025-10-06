// app/_layout.tsx
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoadingScreen from '../components/common/LoadingScreen';
import DrawerNavigator from '../components/navigation/DrawerNavigator';
import { SPLASH_SCREEN_DURATION } from '../constants/config';
import '../global.css'; // ← YE LINE ADD KARO
import { AuthProvider, useAuth } from '../utils/AuthProvider';

const AuthStack = () => (
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="auth/login" />
    <Stack.Screen name="auth/signup" />
  </Stack>
);

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

  return isLoggedIn ? <DrawerNavigator /> : <AuthStack />;
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <RootLayoutNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}