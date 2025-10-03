// app/payment.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import '../global.css';

const PaymentScreen = () => {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800 mb-2">Payments</Text>
          <Text className="text-gray-600">Track rent and transactions</Text>
        </View>

        {/* Empty State */}
        <View className="bg-white rounded-2xl p-8 items-center justify-center shadow-sm" style={{ minHeight: 300 }}>
          <View className="bg-green-100 rounded-full p-6 mb-4">
            <Ionicons name="wallet-outline" size={48} color="#10B981" />
          </View>
          <Text className="text-xl font-bold text-gray-800 mb-2">No Payments Yet</Text>
          <Text className="text-gray-500 text-center">
            Payment history will appear here once transactions are made
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default PaymentScreen;