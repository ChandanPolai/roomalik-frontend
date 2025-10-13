// app/rooms.tsx
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { Alert, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

import LoadingScreen from '../components/common/LoadingScreen';
import { RoomCard, RoomDetails, RoomForm } from '../components/rooms';
import '../global.css';
import plotsApiService from '../services/api/plots.api';
import roomsApiService from '../services/api/rooms.api';
import { Plot, Room, RoomFormData } from '../types';

type ScreenState = 'list' | 'form' | 'details';

const RoomsScreen = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [plots, setPlots] = useState<Plot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenState, setScreenState] = useState<ScreenState>('list');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const [roomsRes, plotsRes] = await Promise.all([
        roomsApiService.getAllRooms(),
        plotsApiService.getAllPlots(),
      ]);
      if (roomsRes.success) setRooms(roomsRes.data);
      else throw new Error(roomsRes.error || 'Failed to load rooms');
      if (plotsRes.success) setPlots(plotsRes.data);
      else throw new Error(plotsRes.error || 'Failed to load plots');
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

  const handleSubmitRoom = async (formData: RoomFormData, images: string[]) => {
    try {
      setIsSubmitting(true);

      const body = new FormData();
      body.append('number', formData.number);
      body.append('size', String(Number(formData.size)));
      body.append('type', formData.type);
      body.append('rent', String(Number(formData.rent)));
      body.append('deposit', String(Number(formData.deposit)));
      body.append('furnished', formData.furnished);
      if (formData.floor) body.append('floor', String(Number(formData.floor)));
      if (formData.facing) body.append('facing', formData.facing);
      if (formData.amenities?.length) body.append('amenities', JSON.stringify(formData.amenities));
      if (formData.status) body.append('status', formData.status);
      body.append('plotId', formData.plotId);

      images
        .filter((uri) => uri.startsWith('file://') || uri.startsWith('content://'))
        .slice(0, 10)
        .forEach((uri, idx) => {
          const name = `image_${Date.now()}_${idx}.jpg`;
          // @ts-ignore React Native FormData file
          body.append('images', { uri, name, type: 'image/jpeg' });
        });

      let response;
      if (selectedRoom) {
        response = await roomsApiService.updateRoom(selectedRoom._id, body);
      } else {
        response = await roomsApiService.createRoom(body);
      }

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: selectedRoom ? 'Room Updated' : 'Room Created',
          text2: selectedRoom ? 'Room has been updated successfully' : 'Room has been created successfully',
        });
        await loadData();
        setScreenState('list');
        setSelectedRoom(null);
      } else {
        throw new Error(response.error || 'Failed to save room');
      }
    } catch (err: any) {
      console.error('Error saving room:', err);
      Toast.show({ type: 'error', text1: 'Error', text2: err.response?.data?.error || 'Failed to save room.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRoom = (room: Room) => {
    Alert.alert('Delete Room', `Are you sure you want to delete room "${room.number}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            const response = await roomsApiService.deleteRoom(room._id);
            if (response.success) {
              Toast.show({ type: 'success', text1: 'Room Deleted', text2: 'Room has been deleted successfully' });
              await loadData();
              if (selectedRoom?._id === room._id) { setScreenState('list'); setSelectedRoom(null); }
            } else { throw new Error(response.error || 'Failed to delete room'); }
          } catch (err: any) {
            console.error('Error deleting room:', err);
            Toast.show({ type: 'error', text1: 'Error', text2: err.response?.data?.error || 'Failed to delete room.' });
          }
        }
      }
    ]);
  };

  const handleRoomPress = (room: Room) => { setSelectedRoom(room); setScreenState('details'); };
  const handleEditRoom = (room: Room) => { setSelectedRoom(room); setScreenState('form'); };
  const handleAddRoom = () => { setSelectedRoom(null); setScreenState('form'); };
  const handleBack = () => { setScreenState('list'); setSelectedRoom(null); };

  if (isLoading) return <LoadingScreen />;
  if (error) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center p-6">
        <View className="bg-white rounded-2xl p-8 items-center shadow-sm">
          <View className="bg-red-100 rounded-full p-6 mb-4">
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          </View>
          <Text className="text-xl font-bold text-gray-800 mb-2">Error Loading Rooms</Text>
          <Text className="text-gray-500 text-center mb-6">{error}</Text>
          <TouchableOpacity onPress={loadData} className="bg-blue-600 px-6 py-3 rounded-lg">
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (screenState === 'form') {
    return (
      <RoomForm room={selectedRoom} plots={plots} onSubmit={handleSubmitRoom} onCancel={handleBack} isLoading={isSubmitting} />
    );
  }

  if (screenState === 'details' && selectedRoom) {
    return (
      <RoomDetails room={selectedRoom} onEdit={handleEditRoom} onDelete={handleDeleteRoom} onClose={handleBack} />
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-6 pt-12 pb-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-gray-800">Rooms</Text>
            <Text className="text-gray-600 mt-1">{rooms.length} {rooms.length === 1 ? 'room' : 'rooms'} available</Text>
          </View>
          <TouchableOpacity onPress={handleAddRoom} className="bg-blue-600 p-3 rounded-xl">
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {rooms.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Animated.View entering={FadeInDown.duration(300)} exiting={FadeOutUp.duration(200)} className="bg-white rounded-3xl p-10 items-center shadow-xl border border-gray-100">
            <View className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full p-8 mb-6">
              <Ionicons name="bed-outline" size={64} color="#3B82F6" />
            </View>
            <Text className="text-2xl font-bold text-gray-800 mb-3">No Rooms Yet</Text>
            <Text className="text-gray-500 text-center mb-8 text-lg leading-6">Start by adding your first room to the system</Text>
            <TouchableOpacity onPress={handleAddRoom} className="bg-blue-600 px-8 py-4 rounded-2xl shadow-lg">
              <Text className="text-white font-bold text-lg">Add Your First Room</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      ) : (
        <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}>
          <Animated.View entering={FadeInDown.duration(300)}>
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} onPress={handleRoomPress} onEdit={handleEditRoom} onDelete={handleDeleteRoom} />
            ))}
          </Animated.View>
        </ScrollView>
      )}

      <Toast />
    </View>
  );
};

export default RoomsScreen;