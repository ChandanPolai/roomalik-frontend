// app/(tabs)/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import '../../global.css';
import { useAuth } from '../../utils/AuthProvider';

const HomeScreen = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/auth/login');
  };

  const quickActions = [
    {
      title: 'Add New Room',
      description: 'Create a new room listing',
      icon: 'add-circle',
      iconBg: 'bg-blue-100',
      iconColor: '#3B82F6',
      onPress: () => router.push('/rooms'),
    },
    {
      title: 'Add Tenant',
      description: 'Register a new tenant',
      icon: 'person-add',
      iconBg: 'bg-purple-100',
      iconColor: '#8B5CF6',
      onPress: () => router.push('/tenants'),
    },
    {
      title: 'Record Payment',
      description: 'Add new payment entry',
      icon: 'wallet',
      iconBg: 'bg-green-100',
      iconColor: '#10B981',
      onPress: () => router.push('/payment'),
    },
  ];

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

          {/* Quick Actions */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              Quick Actions
            </Text>
            
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={action.onPress}
                className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow-sm"
              >
                <View
                  className={`${action.iconBg} rounded-full w-12 h-12 items-center justify-center mr-4`}
                >
                  <Ionicons name={action.icon as any} size={24} color={action.iconColor} />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 font-semibold text-base">
                    {action.title}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {action.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 rounded-xl p-4 flex-row items-center justify-center shadow-lg mt-4"
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
            <Text className="text-white font-semibold text-lg ml-2">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;