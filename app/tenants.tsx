// app/tenants.tsx
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import LoadingScreen from '../components/common/LoadingScreen';
import { TenantCard, TenantDetails, TenantForm } from '../components/tenants';
import '../global.css';
import plotsApiService from '../services/api/plots.api';
import roomsApiService from '../services/api/rooms.api';
import tenantsApiService from '../services/api/tenants.api';
import { Plot, Room, Tenant, TenantFormData } from '../types';

type ScreenState = 'list' | 'form' | 'details';

const TenantsScreen = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenState, setScreenState] = useState<ScreenState>('list');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [tenantsRes, plotsRes, roomsRes] = await Promise.all([
        tenantsApiService.getAllTenants(),
        plotsApiService.getAllPlots(),
        roomsApiService.getAllRooms(),
      ]);
      
      if (tenantsRes.success) setTenants(tenantsRes.data);
      else throw new Error(tenantsRes.error || 'Failed to load tenants');
      
      if (plotsRes.success) setPlots(plotsRes.data);
      else throw new Error(plotsRes.error || 'Failed to load plots');
      
      if (roomsRes.success) setRooms(roomsRes.data);
      else throw new Error(roomsRes.error || 'Failed to load rooms');
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadData();
  }, [loadData]);

  const handleSubmitTenant = async (formData: TenantFormData, documents: any) => {
    try {
      setIsSubmitting(true);

      const body = new FormData();
      
      // Basic info
      body.append('name', formData.name);
      body.append('mobile', formData.mobile);
      body.append('email', formData.email);
      
      // Addresses
      if (formData.permanentStreet || formData.permanentCity || formData.permanentState || formData.permanentCountry || formData.permanentPincode) {
        body.append('addresses', JSON.stringify({
          permanent: {
            street: formData.permanentStreet,
            city: formData.permanentCity,
            state: formData.permanentState,
            country: formData.permanentCountry,
            pincode: formData.permanentPincode,
          },
        }));
      }
      
      if (formData.currentStreet || formData.currentCity || formData.currentState || formData.currentCountry || formData.currentPincode) {
        const currentAddresses = JSON.parse(body.get('addresses') as string || '{}');
        body.delete('addresses');
        body.append('addresses', JSON.stringify({
          ...currentAddresses,
          current: {
            street: formData.currentStreet,
            city: formData.currentCity,
            state: formData.currentState,
            country: formData.currentCountry,
            pincode: formData.currentPincode,
          },
        }));
      }
      
      // Emergency contact
      body.append('emergency', JSON.stringify({
        name: formData.emergencyName,
        relation: formData.emergencyRelation,
        contact: formData.emergencyContact,
      }));
      
      // Profession
      if (formData.occupation || formData.officeStreet || formData.officeCity || formData.officeState || formData.officeCountry || formData.officePincode) {
        body.append('profession', JSON.stringify({
          occupation: formData.occupation,
          officeAddress: {
            street: formData.officeStreet,
            city: formData.officeCity,
            state: formData.officeState,
            country: formData.officeCountry,
            pincode: formData.officePincode,
          },
        }));
      }
      
      // Family members
      if (formData.familyMembers.length > 0) {
        body.append('family', JSON.stringify(formData.familyMembers));
      }
      
      // Agreement
      body.append('agreement', JSON.stringify({
        start: formData.agreementStart,
        end: formData.agreementEnd,
        rent: Number(formData.agreementRent),
        deposit: Number(formData.agreementDeposit),
      }));
      
      // Finances
      body.append('finances', JSON.stringify({
        rent: Number(formData.rent),
        billType: formData.billType,
        paymentMode: formData.paymentMode,
        additionalCharges: formData.additionalCharges,
      }));
      
      // Assignment
      body.append('roomId', formData.roomId);
      body.append('plotId', formData.plotId);
      
      // Documents
      if (documents.aadharFront) {
        body.append('aadharFront', {
          uri: documents.aadharFront,
          name: 'aadhar_front.jpg',
          type: 'image/jpeg',
        } as any);
      }
      
      if (documents.aadharBack) {
        body.append('aadharBack', {
          uri: documents.aadharBack,
          name: 'aadhar_back.jpg',
          type: 'image/jpeg',
        } as any);
      }
      
      if (documents.pan) {
        body.append('pan', {
          uri: documents.pan,
          name: 'pan.jpg',
          type: 'image/jpeg',
        } as any);
      }
      
      if (documents.photo) {
        body.append('photo', {
          uri: documents.photo,
          name: 'photo.jpg',
          type: 'image/jpeg',
        } as any);
      }
      
      if (documents.agreement) {
        body.append('agreement', {
          uri: documents.agreement,
          name: 'agreement.jpg',
          type: 'image/jpeg',
        } as any);
      }

      let response;
      if (selectedTenant) {
        response = await tenantsApiService.updateTenant(selectedTenant._id, body);
      } else {
        response = await tenantsApiService.createTenant(body);
      }

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: selectedTenant ? 'Tenant Updated' : 'Tenant Created',
          text2: selectedTenant ? 'Tenant has been updated successfully' : 'Tenant has been created successfully',
        });
        
        await loadData();
        setScreenState('list');
        setSelectedTenant(null);
      } else {
        throw new Error(response.error || 'Failed to save tenant');
      }
    } catch (err: any) {
      console.error('Error saving tenant:', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.response?.data?.error || 'Failed to save tenant. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTenant = (tenant: Tenant) => {
    Alert.alert(
      'Delete Tenant',
      `Are you sure you want to delete "${tenant.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await tenantsApiService.deleteTenant(tenant._id);
              if (response.success) {
                Toast.show({
                  type: 'success',
                  text1: 'Tenant Deleted',
                  text2: 'Tenant has been deleted successfully',
                });
                
                await loadData();
                
                if (selectedTenant?._id === tenant._id) {
                  setScreenState('list');
                  setSelectedTenant(null);
                }
              } else {
                throw new Error(response.error || 'Failed to delete tenant');
              }
            } catch (err: any) {
              console.error('Error deleting tenant:', err);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: err.response?.data?.error || 'Failed to delete tenant. Please try again.',
              });
            }
          },
        },
      ]
    );
  };

  const handleTenantPress = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setScreenState('details');
  };

  const handleEditTenant = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setScreenState('form');
  };

  const handleAddTenant = () => {
    setSelectedTenant(null);
    setScreenState('form');
  };

  const handleBack = () => {
    setScreenState('list');
    setSelectedTenant(null);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center p-6">
        <View className="bg-white rounded-lg p-6 items-center shadow-sm">
          <View className="bg-red-100 rounded-full p-4 mb-3">
            <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
          </View>
          <Text className="text-lg font-bold text-gray-800 mb-2">Error Loading Tenants</Text>
          <Text className="text-gray-500 text-center mb-4">{error}</Text>
          <TouchableOpacity onPress={loadData} className="bg-blue-600 px-4 py-2 rounded-lg">
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (screenState === 'form') {
    return (
      <TenantForm
        tenant={selectedTenant}
        plots={plots}
        rooms={rooms}
        onSubmit={handleSubmitTenant}
        onCancel={handleBack}
        isLoading={isSubmitting}
      />
    );
  }

  if (screenState === 'details' && selectedTenant) {
    return (
      <TenantDetails
        tenant={selectedTenant}
        onEdit={handleEditTenant}
        onDelete={handleDeleteTenant}
        onClose={handleBack}
      />
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 pt-12 pb-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-800">Tenants</Text>
            <Text className="text-gray-600 text-sm">
              {tenants.length} {tenants.length === 1 ? 'tenant' : 'tenants'} registered
            </Text>
          </View>
          <TouchableOpacity onPress={handleAddTenant} className="bg-blue-600 p-3 rounded-lg">
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {tenants.length === 0 ? (
        <View className="flex-1 items-center justify-center px-4">
          <Animated.View
            entering={FadeInDown.duration(300)}
            exiting={FadeOutUp.duration(200)}
            className="bg-white rounded-lg p-8 items-center shadow-sm border border-gray-100"
          >
            <View className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full p-6 mb-4">
              <Ionicons name="people-outline" size={48} color="#3B82F6" />
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2">No Tenants Yet</Text>
            <Text className="text-gray-500 text-center mb-6 text-sm leading-5">
              Start by adding your first tenant to the system
            </Text>
            <TouchableOpacity onPress={handleAddTenant} className="bg-blue-600 px-6 py-3 rounded-lg shadow-lg">
              <Text className="text-white font-bold">Add Your First Tenant</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
        >
          <Animated.View entering={FadeInDown.duration(300)}>
            {tenants.map((tenant) => (
              <TenantCard
                key={tenant._id}
                tenant={tenant}
                onPress={handleTenantPress}
                onEdit={handleEditTenant}
                onDelete={handleDeleteTenant}
              />
            ))}
          </Animated.View>
        </ScrollView>
      )}

      {/* Toast Messages */}
      <Toast />
    </View>
  );
};

export default TenantsScreen;