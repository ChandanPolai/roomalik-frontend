// components/tenants/tenantCard.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { API_CONFIG } from '../../constants/config';
import { Tenant } from '../../types';

interface TenantCardProps {
  tenant: Tenant;
  onPress: (tenant: Tenant) => void;
  onEdit: (tenant: Tenant) => void;
  onDelete: (tenant: Tenant) => void;
}

const TenantCard: React.FC<TenantCardProps> = ({ tenant, onPress, onEdit, onDelete }) => {
  const getImageUrl = (url: string) => {
    if (url.startsWith('http') || url.startsWith('file://') || url.startsWith('content://')) return url;
    return `${API_CONFIG.IMAGE_URL}${url}`;
  };

  const formatCurrency = (value: number) => `₹${value.toLocaleString()}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoomInfo = () => {
    if (typeof tenant.roomId === 'string') return 'Room Info';
    return `Room ${tenant.roomId.number}`;
  };

  const getPlotInfo = () => {
    if (typeof tenant.plotId === 'string') return 'Plot Info';
    return tenant.plotId.name;
  };

  return (
    <Animated.View entering={FadeInDown.duration(300)} exiting={FadeOutUp.duration(200)} className="bg-white rounded-lg mb-3 shadow-sm border border-gray-100 overflow-hidden">
      <TouchableOpacity onPress={() => onPress(tenant)} activeOpacity={0.7}>
        {/* Header with Photo */}
        <View className="flex-row p-3">
          <View className="mr-3">
            {tenant.ids?.photo ? (
              <Image
                source={{ uri: getImageUrl(tenant.ids.photo) }}
                className="w-16 h-16 rounded-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full items-center justify-center">
                <Ionicons name="person-outline" size={32} color="#6B7280" />
              </View>
            )}
          </View>
          
          <View className="flex-1">
            <View className="flex-row justify-between items-start mb-1">
              <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>
                {tenant.name}
              </Text>
              <View className="flex-row space-x-1">
                <TouchableOpacity onPress={() => onEdit(tenant)} className="bg-blue-50 p-2 rounded-lg" activeOpacity={0.7}>
                  <Ionicons name="pencil" size={16} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(tenant)} className="bg-red-50 p-2 rounded-lg" activeOpacity={0.7}>
                  <Ionicons name="trash" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
            
            <Text className="text-gray-600 text-sm mb-1">{tenant.mobile}</Text>
            <Text className="text-gray-600 text-sm">{tenant.email}</Text>
          </View>
        </View>

        {/* Details */}
        <View className="px-3 pb-3">
          <View className="flex-row items-center mb-2">
            <View className="bg-gray-100 p-1 rounded mr-2">
              <Ionicons name="home-outline" size={14} color="#6B7280" />
            </View>
            <Text className="text-gray-600 text-sm flex-1" numberOfLines={1}>
              {getRoomInfo()} • {getPlotInfo()}
            </Text>
          </View>

          <View className="flex-row items-center mb-2">
            <View className="bg-gray-100 p-1 rounded mr-2">
              <Ionicons name="pricetag-outline" size={14} color="#6B7280" />
            </View>
            <Text className="text-gray-600 text-sm">
              Rent: {formatCurrency(tenant.finances.rent)}
            </Text>
          </View>

          <View className="flex-row items-center justify-between pt-2 border-t border-gray-100">
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={12} color="#9CA3AF" />
              <Text className="text-xs text-gray-400 ml-1">
                Added {formatDate(tenant.createdAt)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
              <Text className="text-xs text-gray-400 ml-1">
                {formatDate(tenant.agreement.start)} - {formatDate(tenant.agreement.end)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TenantCard;
