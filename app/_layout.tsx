// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return (
//     <Stack
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       <Stack.Screen
//         name="index"
//         options={{ headerShown: false }}
//       />
//     </Stack>
//   );
// }

// app/_layout.tsx
import { Stack, Tabs } from 'expo-router';
import { AuthProvider, useAuth } from '../utils/AuthProvider';
import { View, Text, Image } from 'react-native';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

const AuthStack = () => (
  <Stack>
    <Stack.Screen name="auth/login" options={{ headerShown: false }} />
    <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
  </Stack>
);

const MainTabs = () => (
  <Tabs>
    <Tabs.Screen name="(tabs)/index" options={{ title: 'Home' }} />
    <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    {/* Add more tabs later like dashboard, plots, etc. */}
  </Tabs>
);

const LoadingScreen = () => (
  <View className="flex-1 justify-center items-center bg-white">
    <Image
      source={{ uri: 'https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_1280.jpg' }} // Online logo (simple house/nature, change if want)
      className="w-32 h-32 mb-4"
    />
    <Text className="text-3xl font-bold text-center">RoomMalik</Text>
  </View>
);

const RootLayout = () => {
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    SplashScreen.preventAutoHideAsync(); // Custom loading ke liye
    setTimeout(() => SplashScreen.hideAsync(), 2000); // 2 seconds loading show
  }, []);

  return isLoggedIn ? <MainTabs /> : <AuthStack />;
};

export default () => (
  <AuthProvider>
    <RootLayout />
  </AuthProvider>
);