// components/rooms/roomCard.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { API_CONFIG } from '../../constants/config';
import { Room } from '../../types';

interface RoomCardProps {
  room: Room;
  onPress: (room: Room) => void;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onPress, onEdit, onDelete }) => {
  const getImageUrl = (url: string) => {
    if (url.startsWith('http') || url.startsWith('file://') || url.startsWith('content://')) return url;
    return `${API_CONFIG.IMAGE_URL}${url}`;
  };

  const statusColor: Record<string, string> = {
    available: 'bg-green-100 text-green-700',
    occupied: 'bg-red-100 text-red-700',
    maintenance: 'bg-yellow-100 text-yellow-700',
    reserved: 'bg-blue-100 text-blue-700',
  };

  return (
    <Animated.View entering={FadeInDown.duration(300)} exiting={FadeOutUp.duration(200)} className="bg-white rounded-2xl mb-4 shadow-lg border border-gray-100 overflow-hidden">
      <TouchableOpacity onPress={() => onPress(room)} activeOpacity={0.7}>
        {room.images.length > 0 ? (
          <Image source={{ uri: getImageUrl(room.images[0].url) }} className="w-full h-48" resizeMode="cover" />
        ) : (
          <View className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center">
            <Ionicons name="bed-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-400 text-sm mt-2 font-medium">No Image</Text>
          </View>
        )}

        <View className="p-5">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1 mr-3">
              <Text className="text-xl font-bold text-gray-800 mb-1" numberOfLines={1}>
                Room {room.number} • {room.type}
              </Text>
              <Text className="text-gray-500 font-medium">
                Size {room.size} sq ft • ₹{room.rent.toLocaleString()} rent
              </Text>
            </View>
            <View className="flex-row space-x-2">
              <TouchableOpacity onPress={() => onEdit(room)} className="bg-blue-50 p-3 rounded-xl" activeOpacity={0.7}>
                <Ionicons name="pencil" size={18} color="#3B82F6" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDelete(room)} className="bg-red-50 p-3 rounded-xl" activeOpacity={0.7}>
                <Ionicons name="trash" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row items-center mb-3">
            <View className="bg-gray-100 p-2 rounded-lg mr-3">
              <Ionicons name="home-outline" size={18} color="#6B7280" />
            </View>
            <Text className="text-gray-600 font-medium">Deposit ₹{room.deposit.toLocaleString()}</Text>
          </View>

          <View className="flex-row items-center mb-3">
            <View className="bg-gray-100 p-2 rounded-lg mr-3">
              <Ionicons name="pricetag-outline" size={18} color="#6B7280" />
            </View>
            <Text className="text-gray-600 font-medium capitalize">{room.furnished.replace('-', ' ')}</Text>
          </View>

          <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
            <View className={`px-3 py-1 rounded-full ${statusColor[room.status]} `}>
              <Text className="text-xs font-bold capitalize">{room.status}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="images-outline" size={16} color="#9CA3AF" />
              <Text className="text-xs text-gray-400 ml-1 font-medium">{room.images.length} photos</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default RoomCard;


