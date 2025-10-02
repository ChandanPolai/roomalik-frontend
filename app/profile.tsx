// app/profile.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../utils/AuthProvider';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  return (
    <View className="flex-1 justify-center p-4 bg-white">
      <Text className="text-2xl font-bold text-center mb-6">Profile</Text>
      {/* Add more profile details later */}
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default ProfileScreen;