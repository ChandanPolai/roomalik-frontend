// app/(tabs)/index.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../utils/AuthProvider';
import { useRouter } from 'expo-router';
import '../../global.css';

const HomeScreen = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  const dashboardCards = [
    { title: 'Total Rooms', value: '0', icon: 'bed', color: 'bg-blue-500' },
    { title: 'Occupied', value: '0', icon: 'checkmark-circle', color: 'bg-green-500' },
    { title: 'Vacant', value: '0', icon: 'alert-circle', color: 'bg-orange-500' },
    { title: 'Total Tenants', value: '0', icon: 'people', color: 'bg-purple-500' },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Welcome Section */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name || 'User'}! 👋
          </Text>
          <Text className="text-gray-600">Here's your property overview</Text>
        </View>

        {/* Dashboard Cards */}
        <View className="flex-row flex-wrap justify-between mb-6">
          {dashboardCards.map((card, index) => (
            <View
              key={index}
              className="bg-white rounded-2xl p-4 shadow-sm mb-4"
              style={{ width: '48%' }}
            >
              <View className={`${card.color} rounded-full w-12 h-12 items-center justify-center mb-3`}>
                <Ionicons name={card.icon as any} size={24} color="white" />
              </View>
              <Text className="text-2xl font-bold text-gray-800 mb-1">
                {card.value}
              </Text>
              <Text className="text-gray-600 text-sm">{card.title}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Quick Actions</Text>
          
          <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm">
            <View className="bg-blue-100 rounded-full w-12 h-12 items-center justify-center mr-4">
              <Ionicons name="add-circle" size={24} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-semibold text-base">Add New Room</Text>
              <Text className="text-gray-500 text-sm">Create a new room listing</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm">
            <View className="bg-purple-100 rounded-full w-12 h-12 items-center justify-center mr-4">
              <Ionicons name="person-add" size={24} color="#8B5CF6" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-800 font-semibold text-base">Add Tenant</Text>
              <Text className="text-gray-500 text-sm">Register a new tenant</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 rounded-xl p-4 flex-row items-center justify-center shadow-lg"
        >
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text className="text-white font-semibold text-lg ml-2">Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;