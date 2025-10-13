// components/rooms/roomForm.tsx
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp, SlideInDown } from 'react-native-reanimated';
import { API_CONFIG } from '../../constants/config';
import { Plot, Room, RoomFormData, RoomFurnished, RoomStatus } from '../../types';

const { width } = Dimensions.get('window');

interface RoomFormProps {
  room?: Room | null;
  plots: Plot[];
  onSubmit: (data: RoomFormData, images: string[]) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const RoomForm: React.FC<RoomFormProps> = ({ room, plots, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState<RoomFormData>({
    number: '',
    size: '',
    type: '',
    rent: '',
    deposit: '',
    furnished: 'unfurnished',
    floor: '',
    facing: '',
    amenities: [],
    status: 'available',
    plotId: '',
  });

  const [errors, setErrors] = useState<Partial<RoomFormData>>({});
  const [amenityInput, setAmenityInput] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showAvailableFromPicker, setShowAvailableFromPicker] = useState(false);
  const [showAvailableUntilPicker, setShowAvailableUntilPicker] = useState(false);

  useEffect(() => {
    if (room) {
      setFormData({
        number: room.number,
        size: room.size.toString(),
        type: room.type,
        rent: room.rent.toString(),
        deposit: room.deposit.toString(),
        furnished: room.furnished,
        floor: room.floor?.toString() || '',
        facing: room.facing || '',
        amenities: room.amenities || [],
        status: room.status,
        plotId: typeof room.plotId === 'string' ? room.plotId : room.plotId._id,
        availableFrom: room.availableFrom || '',
        availableUntil: room.availableUntil || '',
      });
      setSelectedImages(room.images.map(img => img.url));
    }
  }, [room]);

  // Permissions
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need camera roll permissions to upload images.');
      }
    })();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<RoomFormData> = {};
    if (!formData.number.trim()) newErrors.number = 'Room number is required';
    if (!formData.size.trim() || isNaN(Number(formData.size)) || Number(formData.size) <= 0) newErrors.size = 'Valid size is required';
    if (!formData.type.trim()) newErrors.type = 'Room type is required';
    if (!formData.rent.trim() || isNaN(Number(formData.rent)) || Number(formData.rent) <= 0) newErrors.rent = 'Valid rent is required';
    if (!formData.deposit.trim() || isNaN(Number(formData.deposit)) || Number(formData.deposit) <= 0) newErrors.deposit = 'Valid deposit is required';
    if (!formData.plotId) newErrors.plotId = 'Select a plot';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = (): boolean => {
    return formData.number.trim() !== '' &&
           formData.size.trim() !== '' &&
           !isNaN(Number(formData.size)) &&
           Number(formData.size) > 0 &&
           formData.type.trim() !== '' &&
           formData.rent.trim() !== '' &&
           !isNaN(Number(formData.rent)) &&
           Number(formData.rent) > 0 &&
           formData.deposit.trim() !== '' &&
           !isNaN(Number(formData.deposit)) &&
           Number(formData.deposit) > 0 &&
           formData.plotId !== '';
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: true,
      });
      if (!result.canceled) {
        const newImages = result.assets.map(asset => asset.uri);
        setSelectedImages(prev => [...prev, ...newImages]);
      }
    } catch {
      Alert.alert('Error', 'Failed to pick images. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need camera permissions to take photos.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled) setSelectedImages(prev => [...prev, result.assets[0].uri]);
    } catch {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const removeImage = (index: number) => setSelectedImages(prev => prev.filter((_, i) => i !== index));

  const addAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData(prev => ({ ...prev, amenities: [...prev.amenities, amenityInput.trim()] }));
      setAmenityInput('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setFormData(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== amenity) }));
  };

  const commonAmenities = ['AC', 'WiFi', 'TV', 'Fridge', 'Geyser', 'Washing Machine', 'Parking'];
  const furnishedOptions: RoomFurnished[] = ['furnished', 'semi-furnished', 'unfurnished'];
  const statusOptions: RoomStatus[] = ['available', 'occupied', 'maintenance', 'reserved'];

  const getImageUrl = (url: string) => {
    if (url.startsWith('http') || url.startsWith('file://') || url.startsWith('content://')) return url;
    return `${API_CONFIG.IMAGE_URL}${url}`;
  };

  const handleAvailableFromChange = (event: any, selectedDate?: Date) => {
    setShowAvailableFromPicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, availableFrom: selectedDate.toISOString().split('T')[0] }));
    }
  };

  const handleAvailableUntilChange = (event: any, selectedDate?: Date) => {
    setShowAvailableUntilPicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, availableUntil: selectedDate.toISOString().split('T')[0] }));
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      validateForm(); // Show validation errors
      return;
    }
    try {
      await onSubmit(formData, selectedImages);
    } catch {
      Alert.alert('Error', 'Failed to save room. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
      <Animated.View entering={SlideInDown.duration(300)} className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <TouchableOpacity onPress={onCancel} className="p-2">
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-800">{room ? 'Edit Room' : 'Add New Room'}</Text>
          <TouchableOpacity onPress={handleSubmit} disabled={isLoading || !isFormValid()} className={`px-4 py-2 rounded-lg ${isLoading || !isFormValid() ? 'bg-gray-300' : 'bg-blue-600'}`}>
            <Text className={`font-medium ${isLoading || !isFormValid() ? 'text-gray-500' : 'text-white'}`}>{isLoading ? 'Saving...' : 'Save'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <Animated.View entering={FadeInUp.delay(100).duration(300)} className="p-6 space-y-6">
            {/* Images */}
            <View className="space-y-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-gray-800">Images</Text>
                <View className="flex-row space-x-2">
                  <TouchableOpacity onPress={takePhoto} className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center">
                    <Ionicons name="camera" size={16} color="white" />
                    <Text className="text-white font-medium ml-2">Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={pickImage} className="bg-indigo-600 px-4 py-2 rounded-lg flex-row items-center">
                    <Ionicons name="images" size={16} color="white" />
                    <Text className="text-white font-medium ml-2">Gallery</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {selectedImages.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-3">
                  {selectedImages.map((imageUri, index) => (
                    <View key={index} className="relative">
                      <Image source={{ uri: getImageUrl(imageUri) }} className="rounded-xl" style={{ width: 120, height: 120 }} resizeMode="cover" />
                      <TouchableOpacity onPress={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1">
                        <Ionicons name="close" size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View className="bg-gray-50 rounded-xl h-32 items-center justify-center border-2 border-dashed border-gray-300">
                  <Ionicons name="image-outline" size={32} color="#9CA3AF" />
                  <Text className="text-gray-400 mt-2 text-center">No images selected</Text>
                  <Text className="text-gray-400 text-xs text-center">Use Camera/Gallery to add images</Text>
                </View>
              )}
            </View>

            {/* Basic Info */}
            <View className="space-y-4">
              <Text className="text-lg font-semibold text-gray-800">Basic Information</Text>
              <View className="bg-white rounded-xl p-4 border border-gray-200">
                <Text className="text-sm font-medium text-gray-700 mb-3">Room Number *</Text>
                <TextInput value={formData.number} onChangeText={(text) => setFormData(prev => ({ ...prev, number: text }))} placeholder="Enter room number" className={`text-base px-4 py-4 rounded-lg border ${errors.number ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`} placeholderTextColor="#9CA3AF" />
                {errors.number && <Text className="text-red-500 text-xs mt-2">{errors.number}</Text>}
              </View>

              <View className="bg-white rounded-xl p-4 border border-gray-200">
                <Text className="text-sm font-medium text-gray-700 mb-3">Size (sq ft) *</Text>
                <TextInput value={formData.size} onChangeText={(text) => setFormData(prev => ({ ...prev, size: text }))} placeholder="Enter size" keyboardType="numeric" className={`text-base px-4 py-4 rounded-lg border ${errors.size ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`} placeholderTextColor="#9CA3AF" />
                {errors.size && <Text className="text-red-500 text-xs mt-2">{errors.size}</Text>}
              </View>

              <View className="bg-white rounded-xl p-4 border border-gray-200">
                <Text className="text-sm font-medium text-gray-700 mb-3">Room Type *</Text>
                <TextInput value={formData.type} onChangeText={(text) => setFormData(prev => ({ ...prev, type: text }))} placeholder="e.g., 1BHK, 2BHK, Single" className={`text-base px-4 py-4 rounded-lg border ${errors.type ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`} placeholderTextColor="#9CA3AF" />
                {errors.type && <Text className="text-red-500 text-xs mt-2">{errors.type}</Text>}
              </View>

              <View className="bg-white rounded-xl p-4 border border-gray-200">
                <Text className="text-sm font-medium text-gray-700 mb-3">Rent (₹) *</Text>
                <TextInput value={formData.rent} onChangeText={(text) => setFormData(prev => ({ ...prev, rent: text }))} placeholder="Enter rent" keyboardType="numeric" className={`text-base px-4 py-4 rounded-lg border ${errors.rent ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`} placeholderTextColor="#9CA3AF" />
                {errors.rent && <Text className="text-red-500 text-xs mt-2">{errors.rent}</Text>}
              </View>

              <View className="bg-white rounded-xl p-4 border border-gray-200">
                <Text className="text-sm font-medium text-gray-700 mb-3">Deposit (₹) *</Text>
                <TextInput value={formData.deposit} onChangeText={(text) => setFormData(prev => ({ ...prev, deposit: text }))} placeholder="Enter deposit" keyboardType="numeric" className={`text-base px-4 py-4 rounded-lg border ${errors.deposit ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`} placeholderTextColor="#9CA3AF" />
                {errors.deposit && <Text className="text-red-500 text-xs mt-2">{errors.deposit}</Text>}
              </View>
            </View>

            {/* Selectors */}
            <View className="space-y-4">
              <Text className="text-lg font-semibold text-gray-800">Details</Text>

              <View className="flex-row space-x-3">
                <View className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
                  <Text className="text-sm font-medium text-gray-700 mb-3">Furnished *</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    {furnishedOptions.map((opt) => (
                      <TouchableOpacity key={opt} onPress={() => setFormData(prev => ({ ...prev, furnished: opt }))} className={`px-4 py-3 rounded-full mr-2 border ${formData.furnished === opt ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-300'}`}>
                        <Text className={`text-sm font-medium capitalize ${formData.furnished === opt ? 'text-blue-700' : 'text-gray-600'}`}>{opt.replace('-', ' ')}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <View className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
                  <Text className="text-sm font-medium text-gray-700 mb-3">Status *</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    {statusOptions.map((opt) => (
                      <TouchableOpacity key={opt} onPress={() => setFormData(prev => ({ ...prev, status: opt }))} className={`px-4 py-3 rounded-full mr-2 border ${formData.status === opt ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-300'}`}>
                        <Text className={`text-sm font-medium capitalize ${formData.status === opt ? 'text-blue-700' : 'text-gray-600'}`}>{opt}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <View className="flex-row space-x-3">
                <View className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
                  <Text className="text-sm font-medium text-gray-700 mb-3">Floor</Text>
                  <TextInput value={formData.floor} onChangeText={(text) => setFormData(prev => ({ ...prev, floor: text }))} placeholder="Enter floor" keyboardType="numeric" className="text-base px-4 py-4 rounded-lg border border-gray-300 bg-gray-50" placeholderTextColor="#9CA3AF" />
                </View>
                <View className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
                  <Text className="text-sm font-medium text-gray-700 mb-3">Facing</Text>
                  <TextInput value={formData.facing} onChangeText={(text) => setFormData(prev => ({ ...prev, facing: text }))} placeholder="e.g., East, West" className="text-base px-4 py-4 rounded-lg border border-gray-300 bg-gray-50" placeholderTextColor="#9CA3AF" />
                </View>
              </View>
            </View>

            {/* Amenities */}
            <View className="space-y-4">
              <Text className="text-lg font-semibold text-gray-800">Amenities</Text>
              <View className="bg-white rounded-xl p-4 border border-gray-200">
                <View className="flex-row space-x-3">
                  <TextInput value={amenityInput} onChangeText={setAmenityInput} placeholder="Add amenity" className="flex-1 text-base px-4 py-4 rounded-lg border border-gray-300 bg-gray-50" placeholderTextColor="#9CA3AF" onSubmitEditing={addAmenity} />
                  <TouchableOpacity onPress={addAmenity} className="bg-blue-600 px-6 py-4 rounded-lg flex-row items-center">
                    <Ionicons name="add" size={20} color="white" />
                    <Text className="text-white font-medium ml-1">Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View className="bg-white rounded-xl p-4 border border-gray-200">
                <Text className="text-sm font-medium text-gray-700 mb-3">Quick Add</Text>
                <View className="flex-row flex-wrap gap-2">
                  {commonAmenities.map((a) => (
                    <TouchableOpacity key={a} onPress={() => { if (!formData.amenities.includes(a)) setFormData(prev => ({ ...prev, amenities: [...prev.amenities, a] })); }} className={`px-4 py-3 rounded-full border ${formData.amenities.includes(a) ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-300'}`}>
                      <Text className={`text-sm font-medium ${formData.amenities.includes(a) ? 'text-blue-700' : 'text-gray-600'}`}>{a}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {formData.amenities.length > 0 && (
                <View className="bg-white rounded-xl p-4 border border-gray-200">
                  <Text className="text-sm font-medium text-gray-700 mb-3">Selected Amenities</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {formData.amenities.map((a) => (
                      <View key={a} className="flex-row items-center bg-blue-100 px-4 py-3 rounded-full">
                        <Text className="text-blue-700 text-sm font-medium mr-2">{a}</Text>
                        <TouchableOpacity onPress={() => removeAmenity(a)}>
                          <Ionicons name="close" size={16} color="#1D4ED8" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Plot Selection */}
            <View className="space-y-4">
              <Text className="text-lg font-semibold text-gray-800">Assign to Plot *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {plots.map((p) => (
                  <TouchableOpacity key={(p as Plot)._id} onPress={() => setFormData(prev => ({ ...prev, plotId: (p as Plot)._id }))} className={`px-4 py-3 rounded-full mr-2 border ${(formData.plotId === (p as Plot)._id) ? 'bg-green-100 border-green-300' : 'bg-gray-50 border-gray-300'}`}>
                    <Text className={`text-sm font-medium ${(formData.plotId === (p as Plot)._id) ? 'text-green-700' : 'text-gray-600'}`}>{(p as Plot).name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {errors.plotId && <Text className="text-red-500 text-xs">{errors.plotId}</Text>}
            </View>

            {/* Availability Dates */}
            <View className="space-y-4">
              <Text className="text-lg font-semibold text-gray-800">Availability</Text>
              
              <View className="bg-white rounded-lg p-3 border border-gray-200">
                <Text className="text-sm font-medium text-gray-700 mb-2">Available From</Text>
                <TouchableOpacity
                  onPress={() => setShowAvailableFromPicker(true)}
                  className="px-3 py-3 rounded-lg border border-gray-300 bg-gray-50 flex-row items-center justify-between"
                >
                  <Text className={`text-base ${formData.availableFrom ? 'text-gray-800' : 'text-gray-400'}`}>
                    {formData.availableFrom || 'Select date'}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View className="bg-white rounded-lg p-3 border border-gray-200">
                <Text className="text-sm font-medium text-gray-700 mb-2">Available Until</Text>
                <TouchableOpacity
                  onPress={() => setShowAvailableUntilPicker(true)}
                  className="px-3 py-3 rounded-lg border border-gray-300 bg-gray-50 flex-row items-center justify-between"
                >
                  <Text className={`text-base ${formData.availableUntil ? 'text-gray-800' : 'text-gray-400'}`}>
                    {formData.availableUntil || 'Select date'}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Date Pickers */}
        {showAvailableFromPicker && (
          <DateTimePicker
            value={formData.availableFrom ? new Date(formData.availableFrom) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleAvailableFromChange}
            minimumDate={new Date()}
            maximumDate={new Date(2030, 11, 31)}
          />
        )}

        {showAvailableUntilPicker && (
          <DateTimePicker
            value={formData.availableUntil ? new Date(formData.availableUntil) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleAvailableUntilChange}
            minimumDate={formData.availableFrom ? new Date(formData.availableFrom) : new Date()}
            maximumDate={new Date(2030, 11, 31)}
          />
        )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

export default RoomForm;


