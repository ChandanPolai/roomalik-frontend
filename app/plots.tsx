// app/plots.tsx
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
import '../global.css';

const PlotsScreen = () => {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-800 mb-2">Plots</Text>
          <Text className="text-gray-600">Manage your available plots</Text>
        </View>

        {/* Empty State */}
        <View className="bg-white rounded-2xl p-8 items-center justify-center shadow-sm" style={{ minHeight: 300 }}>
          <View className="bg-blue-100 rounded-full p-6 mb-4">
            <Ionicons name="business-outline" size={48} color="#3B82F6" />
          </View>
          <Text className="text-xl font-bold text-gray-800 mb-2">No Plots Yet</Text>
          <Text className="text-gray-500 text-center">
            Start by adding your first plot to the system
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default PlotsScreen;