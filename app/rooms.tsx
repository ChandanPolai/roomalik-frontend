// app/rooms.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import '../global.css';

const RoomsScreen = () => {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800 mb-2">Rooms</Text>
          <Text className="text-gray-600">Manage your available rooms</Text>
        </View>

        {/* Empty State */}
        <View className="bg-white rounded-2xl p-8 items-center justify-center shadow-sm" style={{ minHeight: 300 }}>
          <View className="bg-blue-100 rounded-full p-6 mb-4">
            <Ionicons name="bed-outline" size={48} color="#3B82F6" />
          </View>
          <Text className="text-xl font-bold text-gray-800 mb-2">No Rooms Yet</Text>
          <Text className="text-gray-500 text-center">
            Start by adding your first room to the system
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default RoomsScreen;