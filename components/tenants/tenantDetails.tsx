// components/tenants/tenantDetails.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { API_CONFIG } from '../../constants/config';
import { Tenant } from '../../types';

interface TenantDetailsProps {
  tenant: Tenant;
  onEdit: (tenant: Tenant) => void;
  onDelete: (tenant: Tenant) => void;
  onClose: () => void;
}

const TenantDetails: React.FC<TenantDetailsProps> = ({ tenant, onEdit, onDelete, onClose }) => {
  const formatCurrency = (value: number) => `₹${value.toLocaleString()}`;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getImageUrl = (url: string) => {
    if (url.startsWith('http') || url.startsWith('file://') || url.startsWith('content://')) return url;
    return `${API_CONFIG.IMAGE_URL}${url}`;
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
    <Animated.View entering={FadeInUp.duration(300)} className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between p-3 border-b border-gray-200">
        <TouchableOpacity onPress={onClose} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-800">Tenant Details</Text>
        <View className="flex-row space-x-2">
          <TouchableOpacity onPress={() => onEdit(tenant)} className="bg-blue-50 p-2 rounded-lg">
            <Ionicons name="pencil" size={20} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(tenant)} className="bg-red-50 p-2 rounded-lg">
            <Ionicons name="trash" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View className="p-3">
          <Text className="text-xl font-bold text-gray-800 mb-3">Basic Information</Text>
          
          <View className="space-y-3">
            <View className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
              <View className="flex-row items-center mb-2">
                {tenant.ids?.photo ? (
                  <Image
                    source={{ uri: getImageUrl(tenant.ids.photo) }}
                    className="w-16 h-16 rounded-full mr-3"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full items-center justify-center mr-3">
                    <Ionicons name="person-outline" size={32} color="#6B7280" />
                  </View>
                )}
                <View className="flex-1">
                  <Text className="text-xl font-bold text-gray-800">{tenant.name}</Text>
                  <Text className="text-gray-600">{tenant.mobile}</Text>
                  <Text className="text-gray-600">{tenant.email}</Text>
                </View>
              </View>
            </View>

            <View className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
              <Text className="text-sm font-medium text-gray-600 mb-2">Room Assignment</Text>
              <Text className="text-lg font-bold text-gray-800">{getRoomInfo()}</Text>
              <Text className="text-gray-600">{getPlotInfo()}</Text>
            </View>

            <View className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
              <Text className="text-sm font-medium text-gray-600 mb-2">Rent Details</Text>
              <Text className="text-lg font-bold text-gray-800">{formatCurrency(tenant.finances.rent)}/month</Text>
              <Text className="text-gray-600">Deposit: {formatCurrency(tenant.agreement.deposit)}</Text>
            </View>
          </View>
        </View>

        {/* Address Information */}
        {(tenant.addresses?.permanent || tenant.addresses?.current) && (
          <View className="px-3 pb-3">
            <Text className="text-xl font-bold text-gray-800 mb-3">Address Information</Text>
            
            {tenant.addresses?.permanent && (
              <View className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm mb-3">
                <Text className="text-sm font-medium text-gray-600 mb-2">Permanent Address</Text>
                <Text className="text-gray-800">
                  {tenant.addresses.permanent.street && `${tenant.addresses.permanent.street}, `}
                  {tenant.addresses.permanent.city && `${tenant.addresses.permanent.city}, `}
                  {tenant.addresses.permanent.state && `${tenant.addresses.permanent.state}, `}
                  {tenant.addresses.permanent.country && `${tenant.addresses.permanent.country}`}
                  {tenant.addresses.permanent.pincode && ` - ${tenant.addresses.permanent.pincode}`}
                </Text>
              </View>
            )}

            {tenant.addresses?.current && (
              <View className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                <Text className="text-sm font-medium text-gray-600 mb-2">Current Address</Text>
                <Text className="text-gray-800">
                  {tenant.addresses.current.street && `${tenant.addresses.current.street}, `}
                  {tenant.addresses.current.city && `${tenant.addresses.current.city}, `}
                  {tenant.addresses.current.state && `${tenant.addresses.current.state}, `}
                  {tenant.addresses.current.country && `${tenant.addresses.current.country}`}
                  {tenant.addresses.current.pincode && ` - ${tenant.addresses.current.pincode}`}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Emergency Contact */}
        <View className="px-3 pb-3">
          <Text className="text-xl font-bold text-gray-800 mb-3">Emergency Contact</Text>
          <View className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <Text className="text-lg font-bold text-gray-800">{tenant.emergency.name}</Text>
            <Text className="text-gray-600">{tenant.emergency.relation}</Text>
            <Text className="text-gray-600">{tenant.emergency.contact}</Text>
          </View>
        </View>

        {/* Professional Information */}
        {tenant.profession && (
          <View className="px-3 pb-3">
            <Text className="text-xl font-bold text-gray-800 mb-3">Professional Information</Text>
            <View className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
              {tenant.profession.occupation && (
                <Text className="text-lg font-bold text-gray-800 mb-2">{tenant.profession.occupation}</Text>
              )}
              {tenant.profession.officeAddress && (
                <Text className="text-gray-600">
                  {tenant.profession.officeAddress.street && `${tenant.profession.officeAddress.street}, `}
                  {tenant.profession.officeAddress.city && `${tenant.profession.officeAddress.city}, `}
                  {tenant.profession.officeAddress.state && `${tenant.profession.officeAddress.state}, `}
                  {tenant.profession.officeAddress.country && `${tenant.profession.officeAddress.country}`}
                  {tenant.profession.officeAddress.pincode && ` - ${tenant.profession.officeAddress.pincode}`}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Family Members */}
        {tenant.family && tenant.family.length > 0 && (
          <View className="px-3 pb-3">
            <Text className="text-xl font-bold text-gray-800 mb-3">Family Members</Text>
            <View className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
              {tenant.family.map((member, index) => (
                <View key={index} className="mb-3 last:mb-0">
                  <Text className="text-lg font-bold text-gray-800">{member.name}</Text>
                  <Text className="text-gray-600">{member.relation} • Age: {member.age}</Text>
                  {member.contact && <Text className="text-gray-600">{member.contact}</Text>}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Agreement Details */}
        <View className="px-3 pb-3">
          <Text className="text-xl font-bold text-gray-800 mb-3">Agreement Details</Text>
          <View className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm font-medium text-gray-600">Start Date</Text>
              <Text className="text-gray-800 font-bold">{formatDate(tenant.agreement.start)}</Text>
            </View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm font-medium text-gray-600">End Date</Text>
              <Text className="text-gray-800 font-bold">{formatDate(tenant.agreement.end)}</Text>
            </View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm font-medium text-gray-600">Rent Amount</Text>
              <Text className="text-gray-800 font-bold">{formatCurrency(tenant.agreement.rent)}</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-medium text-gray-600">Deposit Amount</Text>
              <Text className="text-gray-800 font-bold">{formatCurrency(tenant.agreement.deposit)}</Text>
            </View>
          </View>
        </View>

        {/* Financial Details */}
        <View className="px-3 pb-3">
          <Text className="text-xl font-bold text-gray-800 mb-3">Financial Details</Text>
          <View className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm font-medium text-gray-600">Monthly Rent</Text>
              <Text className="text-gray-800 font-bold">{formatCurrency(tenant.finances.rent)}</Text>
            </View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm font-medium text-gray-600">Bill Type</Text>
              <Text className="text-gray-800 font-bold capitalize">{tenant.finances.billType || 'separate'}</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-medium text-gray-600">Payment Mode</Text>
              <Text className="text-gray-800 font-bold capitalize">{tenant.finances.paymentMode || 'cash'}</Text>
            </View>
            
            {tenant.finances.additionalCharges && tenant.finances.additionalCharges.length > 0 && (
              <View className="mt-3 pt-3 border-t border-gray-200">
                <Text className="text-sm font-medium text-gray-600 mb-2">Additional Charges</Text>
                {tenant.finances.additionalCharges.map((charge, index) => (
                  <View key={index} className="flex-row justify-between items-center mb-1">
                    <Text className="text-gray-600">{charge.type}</Text>
                    <Text className="text-gray-800 font-bold">{formatCurrency(charge.amount)}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Identity Documents */}
        {tenant.ids && (
          <View className="px-3 pb-3">
            <Text className="text-xl font-bold text-gray-800 mb-3">Identity Documents</Text>
            <View className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
              {tenant.ids.aadhar && (
                <View className="mb-3">
                  <Text className="text-sm font-medium text-gray-600 mb-2">Aadhar Card</Text>
                  <View className="flex-row space-x-2">
                    <View className="flex-1">
                      <Text className="text-xs text-gray-500 mb-1">Front</Text>
                      {tenant.ids.aadhar.front ? (
                        <Image
                          source={{ uri: getImageUrl(tenant.ids.aadhar.front) }}
                          className="w-full h-20 rounded-lg"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="w-full h-20 bg-gray-100 rounded-lg items-center justify-center border-2 border-dashed border-gray-300">
                          <Ionicons name="document-outline" size={24} color="#9CA3AF" />
                          <Text className="text-xs text-gray-500 mt-1">No Image</Text>
                        </View>
                      )}
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-gray-500 mb-1">Back</Text>
                      {tenant.ids.aadhar.back ? (
                        <Image
                          source={{ uri: getImageUrl(tenant.ids.aadhar.back) }}
                          className="w-full h-20 rounded-lg"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="w-full h-20 bg-gray-100 rounded-lg items-center justify-center border-2 border-dashed border-gray-300">
                          <Ionicons name="document-outline" size={24} color="#9CA3AF" />
                          <Text className="text-xs text-gray-500 mt-1">No Image</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              )}

              <View className="mb-3">
                <Text className="text-sm font-medium text-gray-600 mb-2">PAN Card</Text>
                {tenant.ids.pan ? (
                  <Image
                    source={{ uri: getImageUrl(tenant.ids.pan) }}
                    className="w-full h-20 rounded-lg"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-20 bg-gray-100 rounded-lg items-center justify-center border-2 border-dashed border-gray-300">
                    <Ionicons name="card-outline" size={24} color="#9CA3AF" />
                    <Text className="text-xs text-gray-500 mt-1">No PAN Card</Text>
                  </View>
                )}
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-600 mb-2">Other Documents</Text>
                {tenant.ids.others && tenant.ids.others.length > 0 ? (
                  tenant.ids.others.map((doc, index) => (
                    <View key={index} className="mb-2">
                      <Text className="text-xs text-gray-500 mb-1">{doc.type}</Text>
                      <Image
                        source={{ uri: getImageUrl(doc.url) }}
                        className="w-full h-20 rounded-lg"
                        resizeMode="cover"
                      />
                    </View>
                  ))
                ) : (
                  <View className="w-full h-20 bg-gray-100 rounded-lg items-center justify-center border-2 border-dashed border-gray-300">
                    <Ionicons name="folder-outline" size={24} color="#9CA3AF" />
                    <Text className="text-xs text-gray-500 mt-1">No Other Documents</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View className="px-3 pb-8">
          <Text className="text-xl font-bold text-gray-800 mb-3">Quick Actions</Text>
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={() => onEdit(tenant)}
              className="flex-1 bg-blue-600 py-3 rounded-lg flex-row items-center justify-center shadow-lg"
            >
              <Ionicons name="pencil" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Edit Tenant</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDelete(tenant)}
              className="flex-1 bg-red-600 py-3 rounded-lg flex-row items-center justify-center shadow-lg"
            >
              <Ionicons name="trash" size={20} color="white" />
              <Text className="text-white font-bold ml-2">Delete Tenant</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

export default TenantDetails;
