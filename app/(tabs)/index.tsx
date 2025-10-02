// app/(tabs)/index.tsx
import React from 'react';
import { View, Text } from 'react-native';
import "../../global.css";

const HomeScreen = () => (
  <View className="flex-1 justify-center items-center bg-white">
    <Text className="text-2xl font-bold">Welcome to RoomMalik Home</Text>
  </View>
);

export default HomeScreen;