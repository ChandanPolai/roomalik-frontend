// components/plots/PlotDetails.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Plot } from '../../types';

interface PlotDetailsProps {
  plot: Plot;
  onEdit: (plot: Plot) => void;
  onDelete: (plot: Plot) => void;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

const PlotDetails: React.FC<PlotDetailsProps> = ({ plot, onEdit, onDelete, onClose }) => {
  const formatArea = (area: number) => {
    if (area >= 10000) {
      return `${(area / 10000).toFixed(1)} acres`;
    }
    return `${area.toLocaleString()} sq ft`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getAddressString = () => {
    const { street, city, state, country, pincode } = plot.address;
    return `${street}, ${city}, ${state}, ${country} - ${pincode}`;
  };

  return (
    <Animated.View entering={FadeInUp.duration(300)} className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
        <TouchableOpacity onPress={onClose} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">Plot Details</Text>
        <View className="flex-row space-x-2">
          <TouchableOpacity
            onPress={() => onEdit(plot)}
            className="bg-blue-50 p-2 rounded-lg"
          >
            <Ionicons name="pencil" size={20} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete(plot)}
            className="bg-red-50 p-2 rounded-lg"
          >
            <Ionicons name="trash" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Images */}
        <View className="p-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Images</Text>
          {plot.images.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-4">
              {plot.images.map((image, index) => (
                <View key={index} className="relative">
                  <Image
                    source={{ uri: image.url }}
                    className="rounded-2xl shadow-lg"
                    style={{ width: width * 0.8, height: 240 }}
                    resizeMode="cover"
                  />
                  {image.caption && (
                    <View className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 rounded-b-2xl p-3">
                      <Text className="text-white text-sm font-medium text-center">
                        {image.caption}
                      </Text>
                    </View>
                  )}
                  <View className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-2 py-1">
                    <Text className="text-gray-800 text-xs font-bold">
                      {index + 1}/{plot.images.length}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
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
              <View className="flex-row items-center mb-3">
                <View className="bg-blue-100 p-2 rounded-lg mr-3">
                  <Ionicons name="business-outline" size={20} color="#3B82F6" />
                </View>
                <Text className="text-sm font-medium text-gray-600">Plot Name</Text>
              </View>
              <Text className="text-xl font-bold text-gray-800">{plot.name}</Text>
            </View>

            <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <View className="flex-row items-center mb-3">
                <View className="bg-green-100 p-2 rounded-lg mr-3">
                  <Ionicons name="resize-outline" size={20} color="#10B981" />
                </View>
                <Text className="text-sm font-medium text-gray-600">Total Area</Text>
              </View>
              <Text className="text-xl font-bold text-gray-800">{formatArea(plot.totalArea)}</Text>
            </View>

            {plot.constructionYear && (
              <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <View className="flex-row items-center mb-3">
                  <View className="bg-purple-100 p-2 rounded-lg mr-3">
                    <Ionicons name="calendar-outline" size={20} color="#8B5CF6" />
                  </View>
                  <Text className="text-sm font-medium text-gray-600">Construction Year</Text>
                </View>
                <Text className="text-xl font-bold text-gray-800">{plot.constructionYear}</Text>
              </View>
            )}

            <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <View className="flex-row items-center mb-3">
                <View className="bg-orange-100 p-2 rounded-lg mr-3">
                  <Ionicons name="time-outline" size={20} color="#F59E0B" />
                </View>
                <Text className="text-sm font-medium text-gray-600">Created Date</Text>
              </View>
              <Text className="text-xl font-bold text-gray-800">{formatDate(plot.createdAt)}</Text>
            </View>
          </View>
        </View>

        {/* Address */}
        <View className="px-6 pb-6">
          <Text className="text-xl font-bold text-gray-800 mb-6">Address</Text>
          <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
            <View className="flex-row items-start">
              <View className="bg-red-100 p-2 rounded-lg mr-3 mt-1">
                <Ionicons name="location-outline" size={20} color="#EF4444" />
              </View>
              <Text className="text-gray-800 flex-1 leading-6 font-medium">{getAddressString()}</Text>
            </View>
          </View>
        </View>

        {/* Location Coordinates */}
        {plot.location && (plot.location.lat || plot.location.lng) && (
          <View className="px-6 pb-6">
            <Text className="text-xl font-bold text-gray-800 mb-6">Location Coordinates</Text>
            <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <View className="space-y-3">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="bg-indigo-100 p-2 rounded-lg mr-3">
                      <Ionicons name="globe-outline" size={20} color="#6366F1" />
                    </View>
                    <Text className="text-gray-600 font-medium">Latitude</Text>
                  </View>
                  <Text className="text-gray-800 font-bold text-lg">{plot.location.lat}</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className="bg-indigo-100 p-2 rounded-lg mr-3">
                      <Ionicons name="globe-outline" size={20} color="#6366F1" />
                    </View>
                    <Text className="text-gray-600 font-medium">Longitude</Text>
                  </View>
                  <Text className="text-gray-800 font-bold text-lg">{plot.location.lng}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Facilities */}
        {plot.facilities.length > 0 && (
          <View className="px-6 pb-6">
            <Text className="text-xl font-bold text-gray-800 mb-6">Facilities</Text>
            <View className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
              <View className="flex-row items-center mb-4">
                <View className="bg-emerald-100 p-2 rounded-lg mr-3">
                  <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                </View>
                <Text className="text-gray-600 font-medium">Available Facilities</Text>
              </View>
              <View className="flex-row flex-wrap gap-3">
                {plot.facilities.map((facility, index) => (
                  <View
                    key={index}
                    className="bg-blue-100 px-4 py-3 rounded-full"
                  >
                    <Text className="text-blue-700 text-sm font-bold">{facility}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View className="px-6 pb-8">
          <Text className="text-xl font-bold text-gray-800 mb-6">Quick Actions</Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity
              onPress={() => onEdit(plot)}
              className="flex-1 bg-blue-600 py-5 rounded-2xl flex-row items-center justify-center shadow-lg"
            >
              <Ionicons name="pencil" size={22} color="white" />
              <Text className="text-white font-bold ml-2 text-lg">Edit Plot</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDelete(plot)}
              className="flex-1 bg-red-600 py-5 rounded-2xl flex-row items-center justify-center shadow-lg"
            >
              <Ionicons name="trash" size={22} color="white" />
              <Text className="text-white font-bold ml-2 text-lg">Delete Plot</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default PlotDetails;
