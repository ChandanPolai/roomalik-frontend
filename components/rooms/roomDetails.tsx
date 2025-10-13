// components/rooms/roomDetails.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Room } from '../../types';
import ImageCarousel from '../plots/ImageCarousel';

interface RoomDetailsProps {
  room: Room;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
  onClose: () => void;
}

const RoomDetails: React.FC<RoomDetailsProps> = ({ room, onEdit, onDelete, onClose }) => {
  const formatCurrency = (value: number) => `₹${value.toLocaleString()}`;

  return (
    <Animated.View entering={FadeInUp.duration(300)} className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <TouchableOpacity onPress={onClose} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">Room Details</Text>
        <View className="flex-row space-x-2">
          <TouchableOpacity onPress={() => onEdit(room)} className="bg-blue-50 p-2 rounded-lg">
            <Ionicons name="pencil" size={20} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(room)} className="bg-red-50 p-2 rounded-lg">
            <Ionicons name="trash" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Images */}
        <View className="p-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Images</Text>
          {room.images.length > 0 ? (
            <ImageCarousel images={room.images} height={240} />
          ) : (
            <View className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl h-48 items-center justify-center border-2 border-dashed border-gray-300">
              <Ionicons name="image-outline" size={64} color="#9CA3AF" />
              <Text className="text-gray-400 mt-3 text-lg font-medium">No Images Available</Text>
              <Text className="text-gray-400 text-sm mt-1">Images will appear here when added</Text>
            </View>
          )}
        </View>

        {/* Basic Information */}
        <View className="px-6 pb-6">
          <Text className="text-xl font-bold text-gray-800 mb-6">Basic Information</Text>
          <View className="space-y-4">
            <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <Text className="text-sm font-medium text-gray-600 mb-2">Room Number</Text>
              <Text className="text-xl font-bold text-gray-800">{room.number}</Text>
            </View>
            <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <Text className="text-sm font-medium text-gray-600 mb-2">Type</Text>
              <Text className="text-xl font-bold text-gray-800">{room.type}</Text>
            </View>
            <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <Text className="text-sm font-medium text-gray-600 mb-2">Size</Text>
              <Text className="text-xl font-bold text-gray-800">{room.size} sq ft</Text>
            </View>
            <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <Text className="text-sm font-medium text-gray-600 mb-2">Rent</Text>
              <Text className="text-xl font-bold text-gray-800">{formatCurrency(room.rent)}</Text>
            </View>
            <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <Text className="text-sm font-medium text-gray-600 mb-2">Deposit</Text>
              <Text className="text-xl font-bold text-gray-800">{formatCurrency(room.deposit)}</Text>
            </View>
            <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <Text className="text-sm font-medium text-gray-600 mb-2">Furnished</Text>
              <Text className="text-xl font-bold text-gray-800 capitalize">{room.furnished.replace('-', ' ')}</Text>
            </View>
            {room.floor !== undefined && (
              <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <Text className="text-sm font-medium text-gray-600 mb-2">Floor</Text>
                <Text className="text-xl font-bold text-gray-800">{room.floor}</Text>
              </View>
            )}
            {room.facing && (
              <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <Text className="text-sm font-medium text-gray-600 mb-2">Facing</Text>
                <Text className="text-xl font-bold text-gray-800">{room.facing}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Amenities */}
        {room.amenities.length > 0 && (
          <View className="px-6 pb-6">
            <Text className="text-xl font-bold text-gray-800 mb-6">Amenities</Text>
            <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <View className="flex-row flex-wrap gap-3">
                {room.amenities.map((a, idx) => (
                  <View key={idx} className="bg-blue-100 px-4 py-3 rounded-full">
                    <Text className="text-blue-700 text-sm font-bold">{a}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Status */}
        <View className="px-6 pb-8">
          <Text className="text-xl font-bold text-gray-800 mb-6">Status</Text>
          <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <Text className="text-lg font-bold capitalize">{room.status}</Text>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default RoomDetails;


