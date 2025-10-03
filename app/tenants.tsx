// app/tenants.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import '../global.css';

const TenantsScreen = () => {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800 mb-2">Tenants</Text>
          <Text className="text-gray-600">Manage your tenant information</Text>
        </View>

        {/* Empty State */}
        <View className="bg-white rounded-2xl p-8 items-center justify-center shadow-sm" style={{ minHeight: 300 }}>
          <View className="bg-purple-100 rounded-full p-6 mb-4">
            <Ionicons name="people-outline" size={48} color="#8B5CF6" />
          </View>
          <Text className="text-xl font-bold text-gray-800 mb-2">No Tenants Yet</Text>
          <Text className="text-gray-500 text-center">
            Add tenants to track their room assignments and payments
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default TenantsScreen;