// app/(tabs)/index.tsx
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import '../../global.css';
import { useAuth } from '../../utils/AuthProvider';

const HomeScreen = () => {
  const { user } = useAuth();
 

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Welcome Section */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {user?.name || 'User'}! 👋
            </Text>
            <Text className="text-gray-600 text-base">
              Manage your properties efficiently
            </Text>
          </View>

         
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;