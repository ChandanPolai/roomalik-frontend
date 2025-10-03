// components/common/LoadingScreen.tsx
import React from 'react';
import { View, Image, ActivityIndicator, Text } from 'react-native';
import { APP_IMAGES } from '../../constants/config';
import '../../global.css';

const LoadingScreen: React.FC = () => {
  return (
    <View className="flex-1 justify-center items-center bg-gradient-to-b from-blue-50 to-white">
      <View className="items-center">
        <Image
          source={{ uri: APP_IMAGES.SPLASH_LOGO }}
          className="w-32 h-32 mb-6"
          resizeMode="contain"
        />
        <Text className="text-4xl font-bold text-gray-800 mb-2">RoomMalik</Text>
        <Text className="text-lg text-gray-500 mb-8">Find Your Perfect Room</Text>
        
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    </View>
  );
};

export default LoadingScreen;