// components/plots/PlotCard.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { API_CONFIG } from '../../constants/config';
import { Plot } from '../../types';

interface PlotCardProps {
  plot: Plot;
  onPress: (plot: Plot) => void;
  onEdit: (plot: Plot) => void;
  onDelete: (plot: Plot) => void;
}

const PlotCard: React.FC<PlotCardProps> = ({ plot, onPress, onEdit, onDelete }) => {
  const formatArea = (area: number) => {
    if (area >= 10000) {
      return `${(area / 10000).toFixed(1)} acres`;
    }
    return `${area.toLocaleString()} sq ft`;
  };

  // Helper function to get full image URL
  const getImageUrl = (url: string) => {
    // If it's already a full URL or local file, return as is
    if (url.startsWith('http') || url.startsWith('file://') || url.startsWith('content://')) {
      return url;
    }
    // Otherwise, prepend the image URL
    return `${API_CONFIG.IMAGE_URL}${url}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(300)}
      exiting={FadeOutUp.duration(200)}
      className="bg-white rounded-2xl mb-4 shadow-lg border border-gray-100 overflow-hidden"
    >
      <TouchableOpacity onPress={() => onPress(plot)} activeOpacity={0.7}>
        {/* Image */}
        {plot.images.length > 0 ? (
          <Image
            source={{ uri: getImageUrl(plot.images[0].url) }}
            className="w-full h-48"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center">
            <Ionicons name="image-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-400 text-sm mt-2 font-medium">No Image</Text>
          </View>
        )}

        {/* Content */}
        <View className="p-5">
          {/* Header */}
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1 mr-3">
              <Text className="text-xl font-bold text-gray-800 mb-1" numberOfLines={1}>
                {plot.name}
              </Text>
              <Text className="text-gray-500 font-medium">
                {plot.address.city}, {plot.address.state}
              </Text>
            </View>
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={() => onEdit(plot)}
                className="bg-blue-50 p-3 rounded-xl"
                activeOpacity={0.7}
              >
                <Ionicons name="pencil" size={18} color="#3B82F6" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onDelete(plot)}
                className="bg-red-50 p-3 rounded-xl"
                activeOpacity={0.7}
              >
                <Ionicons name="trash" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Details */}
          <View className="space-y-3">
            <View className="flex-row items-center">
              <View className="bg-gray-100 p-2 rounded-lg mr-3">
                <Ionicons name="location-outline" size={18} color="#6B7280" />
              </View>
              <Text className="text-gray-600 flex-1 font-medium" numberOfLines={1}>
                {plot.address.street}
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="bg-gray-100 p-2 rounded-lg mr-3">
                <Ionicons name="resize-outline" size={18} color="#6B7280" />
              </View>
              <Text className="text-gray-600 font-medium">
                {formatArea(plot.totalArea)}
              </Text>
            </View>

            {plot.constructionYear && (
              <View className="flex-row items-center">
                <View className="bg-gray-100 p-2 rounded-lg mr-3">
                  <Ionicons name="calendar-outline" size={18} color="#6B7280" />
                </View>
                <Text className="text-gray-600 font-medium">
                  Built in {plot.constructionYear}
                </Text>
              </View>
            )}

            {plot.facilities.length > 0 && (
              <View className="flex-row items-start">
                <View className="bg-gray-100 p-2 rounded-lg mr-3 mt-1">
                  <Ionicons name="checkmark-circle-outline" size={18} color="#6B7280" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-600 font-medium mb-1">Facilities</Text>
                  <Text className="text-sm text-gray-500" numberOfLines={2}>
                    {plot.facilities.slice(0, 3).join(', ')}
                    {plot.facilities.length > 3 && ` +${plot.facilities.length - 3} more`}
                  </Text>
                </View>
              </View>
            )}

            <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                <Text className="text-xs text-gray-400 ml-1 font-medium">
                  Added {formatDate(plot.createdAt)}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="images-outline" size={16} color="#9CA3AF" />
                <Text className="text-xs text-gray-400 ml-1 font-medium">
                  {plot.images.length} photos
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default PlotCard;
