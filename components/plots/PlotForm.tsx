// components/plots/PlotForm.tsx
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInUp, SlideInDown } from 'react-native-reanimated';
import { API_CONFIG } from '../../constants/config';
import { Plot, PlotFormData } from '../../types';

const { width } = Dimensions.get('window');

interface PlotFormProps {
  plot?: Plot | null;
  onSubmit: (data: PlotFormData, images: string[]) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const PlotForm: React.FC<PlotFormProps> = ({ plot, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState<PlotFormData>({
    name: '',
    street: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    totalArea: '',
    constructionYear: '',
    facilities: [],
  });

  const [errors, setErrors] = useState<Partial<PlotFormData>>({});
  const [facilityInput, setFacilityInput] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [showPurchaseDatePicker, setShowPurchaseDatePicker] = useState(false);
  const [showRegistrationDatePicker, setShowRegistrationDatePicker] = useState(false);

  // Helper function to get full image URL
  const getImageUrl = (url: string) => {
    // If it's already a full URL or local file, return as is
    if (url.startsWith('http') || url.startsWith('file://') || url.startsWith('content://')) {
      return url;
    }
    // Otherwise, prepend the image URL
    return `${API_CONFIG.IMAGE_URL}${url}`;
  };

  const handlePurchaseDateChange = (event: any, selectedDate?: Date) => {
    setShowPurchaseDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, purchaseDate: selectedDate.toISOString().split('T')[0] }));
    }
  };

  const handleRegistrationDateChange = (event: any, selectedDate?: Date) => {
    setShowRegistrationDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, registrationDate: selectedDate.toISOString().split('T')[0] }));
    }
  };

  useEffect(() => {
    if (plot) {
      setFormData({
        name: plot.name,
        street: plot.address.street,
        city: plot.address.city,
        state: plot.address.state,
        country: plot.address.country,
        pincode: plot.address.pincode,
        totalArea: plot.totalArea.toString(),
        constructionYear: plot.constructionYear?.toString() || '',
        facilities: plot.facilities,
        purchaseDate: plot.purchaseDate || '',
        registrationDate: plot.registrationDate || '',
      });
      // Set existing images
      setSelectedImages(plot.images.map(img => img.url));
    }
  }, [plot]);

  // Request permissions for image picker
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need camera roll permissions to upload images.');
      }
    })();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<PlotFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Plot name is required';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    }

    if (!formData.totalArea.trim()) {
      newErrors.totalArea = 'Total area is required';
    } else if (isNaN(Number(formData.totalArea)) || Number(formData.totalArea) <= 0) {
      newErrors.totalArea = 'Total area must be a positive number';
    }

    if (formData.constructionYear && (isNaN(Number(formData.constructionYear)) || Number(formData.constructionYear) < 1800)) {
      newErrors.constructionYear = 'Construction year must be a valid year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = (): boolean => {
    return formData.name.trim() !== '' &&
           formData.street.trim() !== '' &&
           formData.city.trim() !== '' &&
           formData.state.trim() !== '' &&
           formData.country.trim() !== '' &&
           formData.pincode.trim() !== '' &&
           formData.totalArea.trim() !== '' &&
           !isNaN(Number(formData.totalArea)) &&
           Number(formData.totalArea) > 0 &&
           (!formData.constructionYear || (!isNaN(Number(formData.constructionYear)) && Number(formData.constructionYear) >= 1800));
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      validateForm(); // Show validation errors
      return;
    }

    try {
      await onSubmit(formData, selectedImages);
    } catch (error) {
      Alert.alert('Error', 'Failed to save plot. Please try again.');
    }
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
    } catch (error) {
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

      if (!result.canceled) {
        setSelectedImages(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const showImageOptions = () => {
    Alert.alert(
      'Add Images',
      'Choose how you want to add images',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Camera', onPress: takePhoto },
        { text: 'Gallery', onPress: pickImage },
      ]
    );
  };

  const addFacility = () => {
    if (facilityInput.trim() && !formData.facilities.includes(facilityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        facilities: [...prev.facilities, facilityInput.trim()],
      }));
      setFacilityInput('');
    }
  };

  const removeFacility = (facility: string) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter(f => f !== facility),
    }));
  };

  const commonFacilities = [
    'Parking', 'Water Supply', 'Electricity', 'Security', 'Garden', 'Swimming Pool',
    'Gym', 'Lift', 'Power Backup', 'Internet', 'CCTV', 'Maintenance'
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <Animated.View
        entering={SlideInDown.duration(300)}
        className="flex-1 bg-white"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
          <TouchableOpacity onPress={onCancel} className="p-2">
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-800">
            {plot ? 'Edit Plot' : 'Add New Plot'}
          </Text>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading || !isFormValid()}
            className={`px-4 py-2 rounded-lg ${isLoading || !isFormValid() ? 'bg-gray-300' : 'bg-blue-600'}`}
          >
            <Text className={`font-medium ${isLoading || !isFormValid() ? 'text-gray-500' : 'text-white'}`}>
              {isLoading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <Animated.View entering={FadeInUp.delay(100).duration(300)} className="p-4 space-y-4">
            {/* Images Section */}
            <View className="space-y-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-gray-800">Images</Text>
                <View className="flex-row space-x-2">
                  <TouchableOpacity
                    onPress={takePhoto}
                    className="bg-blue-600 px-3 py-2 rounded-lg flex-row items-center"
                  >
                    <Ionicons name="camera" size={16} color="white" />
                    <Text className="text-white font-medium ml-1">Camera</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={pickImage}
                    className="bg-indigo-600 px-3 py-2 rounded-lg flex-row items-center"
                  >
                    <Ionicons name="images" size={16} color="white" />
                    <Text className="text-white font-medium ml-1">Gallery</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {selectedImages.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-3">
                  {selectedImages.map((imageUri, index) => (
                    <View key={index} className="relative">
                      <Image
                        source={{ uri: getImageUrl(imageUri) }}
                        className="rounded-xl"
                        style={{ width: 120, height: 120 }}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        onPress={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                      >
                        <Ionicons name="close" size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View className="bg-gray-50 rounded-xl h-32 items-center justify-center border-2 border-dashed border-gray-300">
                  <Ionicons name="image-outline" size={32} color="#9CA3AF" />
                  <Text className="text-gray-400 mt-2 text-center">No images selected</Text>
                  <Text className="text-gray-400 text-xs text-center">Tap "Add Images" to get started</Text>
                </View>
              )}
            </View>

            {/* Basic Information */}
            <View className="space-y-4">
              <Text className="text-lg font-semibold text-gray-800">Basic Information</Text>
              
              <View className="bg-white rounded-lg p-3 border border-gray-200">
                <Text className="text-sm font-medium text-gray-700 mb-3">Plot Name *</Text>
                <TextInput
                  value={formData.name}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                  placeholder="Enter plot name"
                  className={`text-base px-3 py-3 rounded-lg border ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                  placeholderTextColor="#9CA3AF"
                />
                {errors.name && <Text className="text-red-500 text-xs mt-2">{errors.name}</Text>}
              </View>

              <View className="bg-white rounded-lg p-3 border border-gray-200">
                <Text className="text-sm font-medium text-gray-700 mb-3">Total Area (sq ft) *</Text>
                <TextInput
                  value={formData.totalArea}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, totalArea: text }))}
                  placeholder="Enter total area"
                  keyboardType="numeric"
                  className={`text-base px-3 py-3 rounded-lg border ${errors.totalArea ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                  placeholderTextColor="#9CA3AF"
                />
                {errors.totalArea && <Text className="text-red-500 text-xs mt-2">{errors.totalArea}</Text>}
              </View>

              <View className="bg-white rounded-lg p-3 border border-gray-200">
                <Text className="text-sm font-medium text-gray-700 mb-3">Construction Year</Text>
                <TextInput
                  value={formData.constructionYear}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, constructionYear: text }))}
                  placeholder="Enter construction year"
                  keyboardType="numeric"
                  className={`text-base px-3 py-3 rounded-lg border ${errors.constructionYear ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                  placeholderTextColor="#9CA3AF"
                />
                {errors.constructionYear && <Text className="text-red-500 text-xs mt-2">{errors.constructionYear}</Text>}
              </View>
            </View>

            {/* Address Information */}
            <View className="space-y-4">
              <Text className="text-lg font-semibold text-gray-800">Address</Text>
              
              <View className="bg-white rounded-lg p-3 border border-gray-200">
                <Text className="text-sm font-medium text-gray-700 mb-3">Street *</Text>
                <TextInput
                  value={formData.street}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, street: text }))}
                  placeholder="Enter street address"
                  className={`text-base px-3 py-3 rounded-lg border ${errors.street ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                  placeholderTextColor="#9CA3AF"
                />
                {errors.street && <Text className="text-red-500 text-xs mt-2">{errors.street}</Text>}
              </View>

              <View className="flex-row space-x-3">
                <View className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
                  <Text className="text-sm font-medium text-gray-700 mb-3">City *</Text>
                  <TextInput
                    value={formData.city}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
                    placeholder="City"
                    className={`text-base px-3 py-3 rounded-lg border ${errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                    placeholderTextColor="#9CA3AF"
                  />
                  {errors.city && <Text className="text-red-500 text-xs mt-2">{errors.city}</Text>}
                </View>

                <View className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
                  <Text className="text-sm font-medium text-gray-700 mb-3">State *</Text>
                  <TextInput
                    value={formData.state}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, state: text }))}
                    placeholder="State"
                    className={`text-base px-3 py-3 rounded-lg border ${errors.state ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                    placeholderTextColor="#9CA3AF"
                  />
                  {errors.state && <Text className="text-red-500 text-xs mt-2">{errors.state}</Text>}
                </View>
              </View>

              <View className="flex-row space-x-3">
                <View className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
                  <Text className="text-sm font-medium text-gray-700 mb-3">Country *</Text>
                  <TextInput
                    value={formData.country}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, country: text }))}
                    placeholder="Country"
                    className={`text-base px-3 py-3 rounded-lg border ${errors.country ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                    placeholderTextColor="#9CA3AF"
                  />
                  {errors.country && <Text className="text-red-500 text-xs mt-2">{errors.country}</Text>}
                </View>

                <View className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
                  <Text className="text-sm font-medium text-gray-700 mb-3">Pincode *</Text>
                  <TextInput
                    value={formData.pincode}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, pincode: text }))}
                    placeholder="Pincode"
                    keyboardType="numeric"
                    className={`text-base px-3 py-3 rounded-lg border ${errors.pincode ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                    placeholderTextColor="#9CA3AF"
                  />
                  {errors.pincode && <Text className="text-red-500 text-xs mt-2">{errors.pincode}</Text>}
                </View>
              </View>
            </View>

            {/* Facilities */}
            <View className="space-y-4">
              <Text className="text-lg font-semibold text-gray-800">Facilities</Text>
              
              {/* Add Facility */}
              <View className="bg-white rounded-lg p-3 border border-gray-200">
                <View className="flex-row space-x-3">
                  <TextInput
                    value={facilityInput}
                    onChangeText={setFacilityInput}
                    placeholder="Add facility"
                    className="flex-1 text-base px-3 py-3 rounded-lg border border-gray-300 bg-gray-50"
                    placeholderTextColor="#9CA3AF"
                    onSubmitEditing={addFacility}
                  />
                  <TouchableOpacity
                    onPress={addFacility}
                    className="bg-blue-600 px-6 py-4 rounded-lg flex-row items-center"
                  >
                    <Ionicons name="add" size={20} color="white" />
                    <Text className="text-white font-medium ml-1">Add</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Common Facilities */}
              <View className="bg-white rounded-lg p-3 border border-gray-200">
                <Text className="text-sm font-medium text-gray-700 mb-3">Quick Add</Text>
                <View className="flex-row flex-wrap gap-2">
                  {commonFacilities.map((facility) => (
                    <TouchableOpacity
                      key={facility}
                      onPress={() => {
                        if (!formData.facilities.includes(facility)) {
                          setFormData(prev => ({
                            ...prev,
                            facilities: [...prev.facilities, facility],
                          }));
                        }
                      }}
                      className={`px-4 py-3 rounded-full border ${
                        formData.facilities.includes(facility)
                          ? 'bg-blue-100 border-blue-300'
                          : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <Text className={`text-sm font-medium ${
                        formData.facilities.includes(facility)
                          ? 'text-blue-700'
                          : 'text-gray-600'
                      }`}>
                        {facility}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Selected Facilities */}
              {formData.facilities.length > 0 && (
                <View className="bg-white rounded-lg p-3 border border-gray-200">
                  <Text className="text-sm font-medium text-gray-700 mb-3">Selected Facilities</Text>
                  <View className="flex-row flex-wrap gap-2">
                    {formData.facilities.map((facility) => (
                      <View
                        key={facility}
                        className="flex-row items-center bg-blue-100 px-4 py-3 rounded-full"
                      >
                        <Text className="text-blue-700 text-sm font-medium mr-2">{facility}</Text>
                        <TouchableOpacity onPress={() => removeFacility(facility)}>
                          <Ionicons name="close" size={16} color="#1D4ED8" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Important Dates */}
            <View className="space-y-4">
              <Text className="text-lg font-semibold text-gray-800">Important Dates</Text>
              
              <View className="bg-white rounded-lg p-3 border border-gray-200">
                <Text className="text-sm font-medium text-gray-700 mb-2">Purchase Date</Text>
                <TouchableOpacity
                  onPress={() => setShowPurchaseDatePicker(true)}
                  className="px-3 py-3 rounded-lg border border-gray-300 bg-gray-50 flex-row items-center justify-between"
                >
                  <Text className={`text-base ${formData.purchaseDate ? 'text-gray-800' : 'text-gray-400'}`}>
                    {formData.purchaseDate || 'Select purchase date'}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View className="bg-white rounded-lg p-3 border border-gray-200">
                <Text className="text-sm font-medium text-gray-700 mb-2">Registration Date</Text>
                <TouchableOpacity
                  onPress={() => setShowRegistrationDatePicker(true)}
                  className="px-3 py-3 rounded-lg border border-gray-300 bg-gray-50 flex-row items-center justify-between"
                >
                  <Text className={`text-base ${formData.registrationDate ? 'text-gray-800' : 'text-gray-400'}`}>
                    {formData.registrationDate || 'Select registration date'}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Date Pickers */}
        {showPurchaseDatePicker && (
          <DateTimePicker
            value={formData.purchaseDate ? new Date(formData.purchaseDate) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handlePurchaseDateChange}
            maximumDate={new Date()}
          />
        )}

        {showRegistrationDatePicker && (
          <DateTimePicker
            value={formData.registrationDate ? new Date(formData.registrationDate) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleRegistrationDateChange}
            maximumDate={new Date()}
          />
        )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

export default PlotForm;
