// components/tenants/tenantForm.tsx
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp, SlideInDown } from 'react-native-reanimated';
import { API_CONFIG } from '../../constants/config';
import { Plot, Room, Tenant, TenantAdditionalCharge, TenantFamilyMember, TenantFormData } from '../../types';

const { width } = Dimensions.get('window');

interface TenantFormProps {
  tenant?: Tenant | null;
  plots: Plot[];
  rooms: Room[];
  onSubmit: (data: TenantFormData, documents: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

type FormStep = 'basic' | 'address' | 'emergency' | 'profession' | 'family' | 'agreement' | 'finances' | 'assignment';

const TenantForm: React.FC<TenantFormProps> = ({ tenant, plots, rooms, onSubmit, onCancel, isLoading = false }) => {
  const [currentStep, setCurrentStep] = useState<FormStep>('basic');
  const [formData, setFormData] = useState<TenantFormData>({
    name: '',
    mobile: '',
    email: '',
    permanentStreet: '',
    permanentCity: '',
    permanentState: '',
    permanentCountry: '',
    permanentPincode: '',
    currentStreet: '',
    currentCity: '',
    currentState: '',
    currentCountry: '',
    currentPincode: '',
    emergencyName: '',
    emergencyRelation: '',
    emergencyContact: '',
    occupation: '',
    officeStreet: '',
    officeCity: '',
    officeState: '',
    officeCountry: '',
    officePincode: '',
    familyMembers: [],
    agreementStart: '',
    agreementEnd: '',
    agreementRent: '',
    agreementDeposit: '',
    rent: '',
    billType: 'separate',
    paymentMode: 'cash',
    additionalCharges: [],
    roomId: '',
    plotId: '',
  });

  const [errors, setErrors] = useState<Partial<TenantFormData>>({});
  const [documents, setDocuments] = useState<any>({
    aadharFront: null,
    aadharBack: null,
    pan: null,
    photo: null,
    others: [],
    agreement: null,
    familyPhotos: [],
  });
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const steps: FormStep[] = ['basic', 'address', 'emergency', 'profession', 'family', 'agreement', 'finances', 'assignment'];
  const currentStepIndex = steps.indexOf(currentStep);

  useEffect(() => {
    if (tenant) {
      // Populate form data from existing tenant
      setFormData({
        name: tenant.name,
        mobile: tenant.mobile,
        email: tenant.email,
        permanentStreet: tenant.addresses?.permanent?.street || '',
        permanentCity: tenant.addresses?.permanent?.city || '',
        permanentState: tenant.addresses?.permanent?.state || '',
        permanentCountry: tenant.addresses?.permanent?.country || '',
        permanentPincode: tenant.addresses?.permanent?.pincode || '',
        currentStreet: tenant.addresses?.current?.street || '',
        currentCity: tenant.addresses?.current?.city || '',
        currentState: tenant.addresses?.current?.state || '',
        currentCountry: tenant.addresses?.current?.country || '',
        currentPincode: tenant.addresses?.current?.pincode || '',
        emergencyName: tenant.emergency.name,
        emergencyRelation: tenant.emergency.relation,
        emergencyContact: tenant.emergency.contact,
        occupation: tenant.profession?.occupation || '',
        officeStreet: tenant.profession?.officeAddress?.street || '',
        officeCity: tenant.profession?.officeAddress?.city || '',
        officeState: tenant.profession?.officeAddress?.state || '',
        officeCountry: tenant.profession?.officeAddress?.country || '',
        officePincode: tenant.profession?.officeAddress?.pincode || '',
        familyMembers: tenant.family || [],
        agreementStart: tenant.agreement.start,
        agreementEnd: tenant.agreement.end,
        agreementRent: tenant.agreement.rent.toString(),
        agreementDeposit: tenant.agreement.deposit.toString(),
        rent: tenant.finances.rent.toString(),
        billType: tenant.finances.billType || 'separate',
        paymentMode: tenant.finances.paymentMode || 'cash',
        additionalCharges: tenant.finances.additionalCharges || [],
        roomId: typeof tenant.roomId === 'string' ? tenant.roomId : tenant.roomId._id,
        plotId: typeof tenant.plotId === 'string' ? tenant.plotId : tenant.plotId._id,
      });
    }
  }, [tenant]);

  // Permissions
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'We need camera roll permissions to upload documents.');
      }
    })();
  }, []);

  const validateCurrentStep = (): boolean => {
    const newErrors: Partial<TenantFormData> = {};

    switch (currentStep) {
      case 'basic':
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.mobile.trim() || formData.mobile.length < 10) newErrors.mobile = 'Valid mobile number is required';
        if (!formData.email.trim() || !formData.email.includes('@')) newErrors.email = 'Valid email is required';
        break;
      case 'emergency':
        if (!formData.emergencyName.trim()) newErrors.emergencyName = 'Emergency contact name is required';
        if (!formData.emergencyRelation.trim()) newErrors.emergencyRelation = 'Relation is required';
        if (!formData.emergencyContact.trim() || formData.emergencyContact.length < 10) newErrors.emergencyContact = 'Valid contact number is required';
        break;
      case 'agreement':
        if (!formData.agreementStart) newErrors.agreementStart = 'Start date is required';
        if (!formData.agreementEnd) newErrors.agreementEnd = 'End date is required';
        if (!formData.agreementRent.trim() || isNaN(Number(formData.agreementRent)) || Number(formData.agreementRent) <= 0) newErrors.agreementRent = 'Valid rent amount is required';
        if (!formData.agreementDeposit.trim() || isNaN(Number(formData.agreementDeposit)) || Number(formData.agreementDeposit) <= 0) newErrors.agreementDeposit = 'Valid deposit amount is required';
        break;
      case 'finances':
        if (!formData.rent.trim() || isNaN(Number(formData.rent)) || Number(formData.rent) <= 0) newErrors.rent = 'Valid rent amount is required';
        break;
      case 'assignment':
        if (!formData.plotId) newErrors.plotId = 'Select a plot';
        if (!formData.roomId) newErrors.roomId = 'Select a room';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 'basic':
        return formData.name.trim() !== '' && 
               formData.mobile.trim().length >= 10 && 
               formData.email.trim() !== '' && 
               formData.email.includes('@');
      case 'emergency':
        return formData.emergencyName.trim() !== '' && 
               formData.emergencyRelation.trim() !== '' && 
               formData.emergencyContact.trim().length >= 10;
      case 'agreement':
        return formData.agreementStart !== '' && 
               formData.agreementEnd !== '' && 
               formData.agreementRent.trim() !== '' && 
               !isNaN(Number(formData.agreementRent)) && 
               Number(formData.agreementRent) > 0 &&
               formData.agreementDeposit.trim() !== '' && 
               !isNaN(Number(formData.agreementDeposit)) && 
               Number(formData.agreementDeposit) > 0;
      case 'finances':
        return formData.rent.trim() !== '' && 
               !isNaN(Number(formData.rent)) && 
               Number(formData.rent) > 0;
      case 'assignment':
        return formData.plotId !== '' && formData.roomId !== '';
      default:
        return true; // address, profession, family steps are optional
    }
  };

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    }
  };

  const pickDocument = async (type: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setDocuments(prev => ({
          ...prev,
          [type]: result.assets[0].uri,
        }));
      }
    } catch {
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const takePhoto = async (type: string) => {
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
        setDocuments(prev => ({
          ...prev,
          [type]: result.assets[0].uri,
        }));
      }
    } catch {
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const addFamilyMember = () => {
    setFormData(prev => ({
      ...prev,
      familyMembers: [...prev.familyMembers, { name: '', age: 0, relation: '', contact: '' }],
    }));
  };

  const updateFamilyMember = (index: number, field: keyof TenantFamilyMember, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.map((member, i) =>
        i === index ? { ...member, [field]: value } : member
      ),
    }));
  };

  const removeFamilyMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((_, i) => i !== index),
    }));
  };

  const addAdditionalCharge = () => {
    setFormData(prev => ({
      ...prev,
      additionalCharges: [...prev.additionalCharges, { type: '', amount: 0 }],
    }));
  };

  const updateAdditionalCharge = (index: number, field: keyof TenantAdditionalCharge, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      additionalCharges: prev.additionalCharges.map((charge, i) =>
        i === index ? { ...charge, [field]: value } : charge
      ),
    }));
  };

  const removeAdditionalCharge = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additionalCharges: prev.additionalCharges.filter((_, i) => i !== index),
    }));
  };

  const getImageUrl = (url: string) => {
    if (url.startsWith('http') || url.startsWith('file://') || url.startsWith('content://')) return url;
    return `${API_CONFIG.IMAGE_URL}${url}`;
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }
    
    try {
      await onSubmit(formData, documents);
    } catch {
      Alert.alert('Error', 'Failed to save tenant. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, agreementStart: selectedDate.toISOString().split('T')[0] }));
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, agreementEnd: selectedDate.toISOString().split('T')[0] }));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <View className="space-y-3">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Basic Information</Text>
            
            <View className="bg-white rounded-lg p-3 border border-gray-200">
              <Text className="text-sm font-medium text-gray-700 mb-2">Full Name *</Text>
              <TextInput
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholder="Enter full name"
                className={`text-base px-3 py-3 rounded-lg border ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                placeholderTextColor="#9CA3AF"
              />
              {errors.name && <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>}
            </View>

            <View className="bg-white rounded-lg p-3 border border-gray-200">
              <Text className="text-sm font-medium text-gray-700 mb-2">Mobile Number *</Text>
              <TextInput
                value={formData.mobile}
                onChangeText={(text) => setFormData(prev => ({ ...prev, mobile: text }))}
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
                className={`text-base px-3 py-3 rounded-lg border ${errors.mobile ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                placeholderTextColor="#9CA3AF"
              />
              {errors.mobile && <Text className="text-red-500 text-xs mt-1">{errors.mobile}</Text>}
            </View>

            <View className="bg-white rounded-lg p-3 border border-gray-200">
              <Text className="text-sm font-medium text-gray-700 mb-2">Email Address *</Text>
              <TextInput
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder="Enter email address"
                keyboardType="email-address"
                className={`text-base px-3 py-3 rounded-lg border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                placeholderTextColor="#9CA3AF"
              />
              {errors.email && <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>}
            </View>

            {/* Photo Upload */}
            <View className="bg-white rounded-lg p-3 border border-gray-200">
              <Text className="text-sm font-medium text-gray-700 mb-2">Profile Photo</Text>
              <View className="flex-row space-x-2">
                <TouchableOpacity onPress={() => takePhoto('photo')} className="bg-blue-600 px-3 py-2 rounded-lg flex-row items-center">
                  <Ionicons name="camera" size={16} color="white" />
                  <Text className="text-white font-medium ml-1">Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => pickDocument('photo')} className="bg-indigo-600 px-3 py-2 rounded-lg flex-row items-center">
                  <Ionicons name="images" size={16} color="white" />
                  <Text className="text-white font-medium ml-1">Gallery</Text>
                </TouchableOpacity>
              </View>
              {documents.photo && (
                <View className="mt-3">
                  <Image source={{ uri: documents.photo }} className="w-20 h-20 rounded-lg" resizeMode="cover" />
                </View>
              )}
            </View>
          </View>
        );

      case 'address':
        return (
          <View className="space-y-3">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Address Information</Text>
            
            {/* Permanent Address */}
            <View className="bg-white rounded-lg p-3 border border-gray-200">
              <Text className="text-sm font-medium text-gray-700 mb-2">Permanent Address</Text>
              <TextInput
                value={formData.permanentStreet}
                onChangeText={(text) => setFormData(prev => ({ ...prev, permanentStreet: text }))}
                placeholder="Street address"
                className="text-base px-3 py-3 rounded-lg border border-gray-300 bg-gray-50 mb-2"
                placeholderTextColor="#9CA3AF"
              />
              <View className="flex-row space-x-2">
                <TextInput
                  value={formData.permanentCity}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, permanentCity: text }))}
                  placeholder="City"
                  className="flex-1 text-base px-3 py-3 rounded-lg border border-gray-300 bg-gray-50"
                  placeholderTextColor="#9CA3AF"
                />
                <TextInput
                  value={formData.permanentState}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, permanentState: text }))}
                  placeholder="State"
                  className="flex-1 text-base px-3 py-3 rounded-lg border border-gray-300 bg-gray-50"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View className="flex-row space-x-2 mt-2">
                <TextInput
                  value={formData.permanentCountry}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, permanentCountry: text }))}
                  placeholder="Country"
                  className="flex-1 text-base px-3 py-3 rounded-lg border border-gray-300 bg-gray-50"
                  placeholderTextColor="#9CA3AF"
                />
                <TextInput
                  value={formData.permanentPincode}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, permanentPincode: text }))}
                  placeholder="Pincode"
                  keyboardType="numeric"
                  className="flex-1 text-base px-3 py-3 rounded-lg border border-gray-300 bg-gray-50"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Current Address */}
            <View className="bg-white rounded-lg p-3 border border-gray-200">
              <Text className="text-sm font-medium text-gray-700 mb-2">Current Address</Text>
              <TextInput
                value={formData.currentStreet}
                onChangeText={(text) => setFormData(prev => ({ ...prev, currentStreet: text }))}
                placeholder="Street address"
                className="text-base px-3 py-3 rounded-lg border border-gray-300 bg-gray-50 mb-2"
                placeholderTextColor="#9CA3AF"
              />
              <View className="flex-row space-x-2">
                <TextInput
                  value={formData.currentCity}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, currentCity: text }))}
                  placeholder="City"
                  className="flex-1 text-base px-3 py-3 rounded-lg border border-gray-300 bg-gray-50"
                  placeholderTextColor="#9CA3AF"
                />
                <TextInput
                  value={formData.currentState}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, currentState: text }))}
                  placeholder="State"
                  className="flex-1 text-base px-3 py-3 rounded-lg border border-gray-300 bg-gray-50"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View className="flex-row space-x-2 mt-2">
                <TextInput
                  value={formData.currentCountry}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, currentCountry: text }))}
                  placeholder="Country"
                  className="flex-1 text-base px-3 py-3 rounded-lg border border-gray-300 bg-gray-50"
                  placeholderTextColor="#9CA3AF"
                />
                <TextInput
                  value={formData.currentPincode}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, currentPincode: text }))}
                  placeholder="Pincode"
                  keyboardType="numeric"
                  className="flex-1 text-base px-3 py-3 rounded-lg border border-gray-300 bg-gray-50"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>
        );

      case 'emergency':
        return (
          <View className="space-y-3">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Emergency Contact</Text>
            
            <View className="bg-white rounded-lg p-3 border border-gray-200">
              <Text className="text-sm font-medium text-gray-700 mb-2">Contact Name *</Text>
              <TextInput
                value={formData.emergencyName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, emergencyName: text }))}
                placeholder="Enter contact name"
                className={`text-base px-3 py-3 rounded-lg border ${errors.emergencyName ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                placeholderTextColor="#9CA3AF"
              />
              {errors.emergencyName && <Text className="text-red-500 text-xs mt-1">{errors.emergencyName}</Text>}
            </View>

            <View className="bg-white rounded-lg p-3 border border-gray-200">
              <Text className="text-sm font-medium text-gray-700 mb-2">Relation *</Text>
              <TextInput
                value={formData.emergencyRelation}
                onChangeText={(text) => setFormData(prev => ({ ...prev, emergencyRelation: text }))}
                placeholder="e.g., Father, Mother, Spouse"
                className={`text-base px-3 py-3 rounded-lg border ${errors.emergencyRelation ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                placeholderTextColor="#9CA3AF"
              />
              {errors.emergencyRelation && <Text className="text-red-500 text-xs mt-1">{errors.emergencyRelation}</Text>}
            </View>

            <View className="bg-white rounded-lg p-3 border border-gray-200">
              <Text className="text-sm font-medium text-gray-700 mb-2">Contact Number *</Text>
              <TextInput
                value={formData.emergencyContact}
                onChangeText={(text) => setFormData(prev => ({ ...prev, emergencyContact: text }))}
                placeholder="Enter contact number"
                keyboardType="phone-pad"
                className={`text-base px-3 py-3 rounded-lg border ${errors.emergencyContact ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                placeholderTextColor="#9CA3AF"
              />
              {errors.emergencyContact && <Text className="text-red-500 text-xs mt-1">{errors.emergencyContact}</Text>}
            </View>
          </View>
        );

      case 'profession':
        return (
          <View className="space-y-3">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Professional Information</Text>
            
            <View className="bg-white rounded-lg p-3 border border-gray-200">
              <Text className="text-sm font-medium text-gray-700 mb-2">Occupation</Text>
              <TextInput
                value={formData.occupation}
                onChangeText={(text) => setFormData(prev => ({ ...prev, occupation: text }))}
                placeholder="Enter occupation"
                className="text-base px-3 py-3 rounded-lg border border-gray-300 bg-gray-50"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View className="bg-white rounded-lg p-3 border border-gray-200">
              <Text className="text-sm font-medium text-gray-700 mb-2">Office Address</Text>
              <TextInput
                value={formData.officeStreet}
                onChangeText={(text) => setFormData(prev => ({ ...prev, officeStreet: text }))}
                placeholder="Street address"
                className="text-base px-3 py-3 rounded-lg border border-gray-300 bg-gray-50 mb-2"
                placeholderTextColor="#9CA3AF"
              />
              <View className="flex-row space-x-2">
                <TextInput
                  value={formData.officeCity}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, officeCity: text }))}
                  placeholder="City"
                  className="flex-1 text-base px-3 py-3 rounded-lg border border-gray-300 bg-gray-50"
                  placeholderTextColor="#9CA3AF"
                />
                <TextInput
                  value={formData.officeState}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, officeState: text }))}
                  placeholder="State"
                  className="flex-1 text-base px-3 py-3 rounded-lg border border-gray-300 bg-gray-50"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View className="flex-row space-x-2 mt-2">
                <TextInput
                  value={formData.officeCountry}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, officeCountry: text }))}
                  placeholder="Country"
                  className="flex-1 text-base px-3 py-3 rounded-lg border border-gray-300 bg-gray-50"
                  placeholderTextColor="#9CA3AF"
                />
                <TextInput
                  value={formData.officePincode}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, officePincode: text }))}
                  placeholder="Pincode"
                  keyboardType="numeric"
                  className="flex-1 text-base px-3 py-3 rounded-lg border border-gray-300 bg-gray-50"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>
        );

      case 'family':
        return (
          <View className="space-y-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-gray-800">Family Members</Text>
              <TouchableOpacity onPress={addFamilyMember} className="bg-blue-600 px-3 py-2 rounded-lg">
                <Text className="text-white font-medium">Add Member</Text>
              </TouchableOpacity>
            </View>
            
            {formData.familyMembers.map((member, index) => (
              <View key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-sm font-medium text-gray-700">Member {index + 1}</Text>
                  <TouchableOpacity onPress={() => removeFamilyMember(index)}>
                    <Ionicons name="trash" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
                
                <TextInput
                  value={member.name}
                  onChangeText={(text) => updateFamilyMember(index, 'name', text)}
                  placeholder="Name"
                  className="text-base px-3 py-3 rounded-lg border border-gray-300 bg-gray-50 mb-2"
                  placeholderTextColor="#9CA3AF"
                />
                
                <View className="flex-row space-x-2">
                  <TextInput
                    value={member.age.toString()}
                    onChangeText={(text) => updateFamilyMember(index, 'age', parseInt(text) || 0)}
                    placeholder="Age"
                    keyboardType="numeric"
                    className="flex-1 text-base px-3 py-3 rounded-lg border border-gray-300 bg-gray-50"
                    placeholderTextColor="#9CA3AF"
                  />
                  <TextInput
                    value={member.relation}
                    onChangeText={(text) => updateFamilyMember(index, 'relation', text)}
                    placeholder="Relation"
                    className="flex-1 text-base px-3 py-3 rounded-lg border border-gray-300 bg-gray-50"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                
                <TextInput
                  value={member.contact || ''}
                  onChangeText={(text) => updateFamilyMember(index, 'contact', text)}
                  placeholder="Contact (optional)"
                  keyboardType="phone-pad"
                  className="text-base px-3 py-3 rounded-lg border border-gray-300 bg-gray-50 mt-2"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            ))}
          </View>
        );

      case 'agreement':
        return (
          <View className="space-y-3">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Agreement Details</Text>
            
            <View className="bg-white rounded-lg p-3 border border-gray-200">
              <Text className="text-sm font-medium text-gray-700 mb-2">Start Date *</Text>
              <TouchableOpacity
                onPress={() => setShowStartDatePicker(true)}
                className={`px-3 py-3 rounded-lg border ${errors.agreementStart ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'} flex-row items-center justify-between`}
              >
                <Text className={`text-base ${formData.agreementStart ? 'text-gray-800' : 'text-gray-400'}`}>
                  {formData.agreementStart || 'Select start date'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              </TouchableOpacity>
              {errors.agreementStart && <Text className="text-red-500 text-xs mt-1">{errors.agreementStart}</Text>}
            </View>

            <View className="bg-white rounded-lg p-3 border border-gray-200">
              <Text className="text-sm font-medium text-gray-700 mb-2">End Date *</Text>
              <TouchableOpacity
                onPress={() => setShowEndDatePicker(true)}
                className={`px-3 py-3 rounded-lg border ${errors.agreementEnd ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'} flex-row items-center justify-between`}
              >
                <Text className={`text-base ${formData.agreementEnd ? 'text-gray-800' : 'text-gray-400'}`}>
                  {formData.agreementEnd || 'Select end date'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              </TouchableOpacity>
              {errors.agreementEnd && <Text className="text-red-500 text-xs mt-1">{errors.agreementEnd}</Text>}
            </View>

            <View className="bg-white rounded-lg p-3 border border-gray-200">
              <Text className="text-sm font-medium text-gray-700 mb-2">Rent Amount *</Text>
              <TextInput
                value={formData.agreementRent}
                onChangeText={(text) => setFormData(prev => ({ ...prev, agreementRent: text }))}
                placeholder="Enter rent amount"
                keyboardType="numeric"
                className={`text-base px-3 py-3 rounded-lg border ${errors.agreementRent ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                placeholderTextColor="#9CA3AF"
              />
              {errors.agreementRent && <Text className="text-red-500 text-xs mt-1">{errors.agreementRent}</Text>}
            </View>

            <View className="bg-white rounded-lg p-3 border border-gray-200">
              <Text className="text-sm font-medium text-gray-700 mb-2">Deposit Amount *</Text>
              <TextInput
                value={formData.agreementDeposit}
                onChangeText={(text) => setFormData(prev => ({ ...prev, agreementDeposit: text }))}
                placeholder="Enter deposit amount"
                keyboardType="numeric"
                className={`text-base px-3 py-3 rounded-lg border ${errors.agreementDeposit ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                placeholderTextColor="#9CA3AF"
              />
              {errors.agreementDeposit && <Text className="text-red-500 text-xs mt-1">{errors.agreementDeposit}</Text>}
            </View>

            {/* Agreement Document */}
            <View className="bg-white rounded-lg p-3 border border-gray-200">
              <Text className="text-sm font-medium text-gray-700 mb-2">Agreement Document</Text>
              <View className="flex-row space-x-2">
                <TouchableOpacity onPress={() => takePhoto('agreement')} className="bg-blue-600 px-3 py-2 rounded-lg flex-row items-center">
                  <Ionicons name="camera" size={16} color="white" />
                  <Text className="text-white font-medium ml-1">Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => pickDocument('agreement')} className="bg-indigo-600 px-3 py-2 rounded-lg flex-row items-center">
                  <Ionicons name="images" size={16} color="white" />
                  <Text className="text-white font-medium ml-1">Gallery</Text>
                </TouchableOpacity>
              </View>
              {documents.agreement && (
                <View className="mt-3">
                  <Image source={{ uri: documents.agreement }} className="w-full h-32 rounded-lg" resizeMode="cover" />
                </View>
              )}
            </View>
          </View>
        );

      case 'finances':
        return (
          <View className="space-y-3">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Financial Details</Text>
            
            <View className="bg-white rounded-lg p-3 border border-gray-200">
              <Text className="text-sm font-medium text-gray-700 mb-2">Monthly Rent *</Text>
              <TextInput
                value={formData.rent}
                onChangeText={(text) => setFormData(prev => ({ ...prev, rent: text }))}
                placeholder="Enter monthly rent"
                keyboardType="numeric"
                className={`text-base px-3 py-3 rounded-lg border ${errors.rent ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                placeholderTextColor="#9CA3AF"
              />
              {errors.rent && <Text className="text-red-500 text-xs mt-1">{errors.rent}</Text>}
            </View>

            <View className="bg-white rounded-lg p-3 border border-gray-200">
              <Text className="text-sm font-medium text-gray-700 mb-2">Bill Type</Text>
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  onPress={() => setFormData(prev => ({ ...prev, billType: 'included' }))}
                  className={`px-4 py-3 rounded-lg border ${formData.billType === 'included' ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-300'}`}
                >
                  <Text className={`text-sm font-medium ${formData.billType === 'included' ? 'text-blue-700' : 'text-gray-600'}`}>
                    Included
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setFormData(prev => ({ ...prev, billType: 'separate' }))}
                  className={`px-4 py-3 rounded-lg border ${formData.billType === 'separate' ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-300'}`}
                >
                  <Text className={`text-sm font-medium ${formData.billType === 'separate' ? 'text-blue-700' : 'text-gray-600'}`}>
                    Separate
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="bg-white rounded-lg p-3 border border-gray-200">
              <Text className="text-sm font-medium text-gray-700 mb-2">Payment Mode</Text>
              <View className="flex-row space-x-2">
                {['cash', 'online', 'cheque'].map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    onPress={() => setFormData(prev => ({ ...prev, paymentMode: mode as any }))}
                    className={`px-4 py-3 rounded-lg border ${formData.paymentMode === mode ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-300'}`}
                  >
                    <Text className={`text-sm font-medium capitalize ${formData.paymentMode === mode ? 'text-blue-700' : 'text-gray-600'}`}>
                      {mode}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Additional Charges */}
            <View className="bg-white rounded-lg p-3 border border-gray-200">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-medium text-gray-700">Additional Charges</Text>
                <TouchableOpacity onPress={addAdditionalCharge} className="bg-blue-600 px-3 py-2 rounded-lg">
                  <Text className="text-white font-medium text-xs">Add</Text>
                </TouchableOpacity>
              </View>
              
              {formData.additionalCharges.map((charge, index) => (
                <View key={index} className="flex-row space-x-2 mb-2">
                  <TextInput
                    value={charge.type}
                    onChangeText={(text) => updateAdditionalCharge(index, 'type', text)}
                    placeholder="Type"
                    className="flex-1 text-base px-3 py-3 rounded-lg border border-gray-300 bg-gray-50"
                    placeholderTextColor="#9CA3AF"
                  />
                  <TextInput
                    value={charge.amount.toString()}
                    onChangeText={(text) => updateAdditionalCharge(index, 'amount', parseInt(text) || 0)}
                    placeholder="Amount"
                    keyboardType="numeric"
                    className="flex-1 text-base px-3 py-3 rounded-lg border border-gray-300 bg-gray-50"
                    placeholderTextColor="#9CA3AF"
                  />
                  <TouchableOpacity onPress={() => removeAdditionalCharge(index)} className="bg-red-100 p-3 rounded-lg">
                    <Ionicons name="trash" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        );

      case 'assignment':
        return (
          <View className="space-y-3">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Room Assignment</Text>
            
            <View className="bg-white rounded-lg p-3 border border-gray-200">
              <Text className="text-sm font-medium text-gray-700 mb-2">Select Plot *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {plots.map((plot) => (
                  <TouchableOpacity
                    key={plot._id}
                    onPress={() => setFormData(prev => ({ ...prev, plotId: plot._id }))}
                    className={`px-4 py-3 rounded-lg mr-2 border ${formData.plotId === plot._id ? 'bg-green-100 border-green-300' : 'bg-gray-50 border-gray-300'}`}
                  >
                    <Text className={`text-sm font-medium ${formData.plotId === plot._id ? 'text-green-700' : 'text-gray-600'}`}>
                      {plot.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {errors.plotId && <Text className="text-red-500 text-xs mt-1">{errors.plotId}</Text>}
            </View>

            <View className="bg-white rounded-lg p-3 border border-gray-200">
              <Text className="text-sm font-medium text-gray-700 mb-2">Select Room *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {rooms
                  .filter(room => typeof room.plotId === 'string' ? room.plotId === formData.plotId : room.plotId._id === formData.plotId)
                  .map((room) => (
                    <TouchableOpacity
                      key={room._id}
                      onPress={() => setFormData(prev => ({ ...prev, roomId: room._id }))}
                      className={`px-4 py-3 rounded-lg mr-2 border ${formData.roomId === room._id ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-300'}`}
                    >
                      <Text className={`text-sm font-medium ${formData.roomId === room._id ? 'text-blue-700' : 'text-gray-600'}`}>
                        Room {room.number}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
              {errors.roomId && <Text className="text-red-500 text-xs mt-1">{errors.roomId}</Text>}
            </View>

            {/* Document Uploads */}
            <View className="bg-white rounded-lg p-3 border border-gray-200">
              <Text className="text-sm font-medium text-gray-700 mb-2">Identity Documents</Text>
              
              {/* Aadhar */}
              <View className="mb-3">
                <Text className="text-xs text-gray-600 mb-1">Aadhar Card</Text>
                <View className="flex-row space-x-2">
                  <TouchableOpacity onPress={() => takePhoto('aadharFront')} className="bg-blue-600 px-3 py-2 rounded-lg flex-row items-center">
                    <Ionicons name="camera" size={14} color="white" />
                    <Text className="text-white font-medium ml-1 text-xs">Front</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => takePhoto('aadharBack')} className="bg-indigo-600 px-3 py-2 rounded-lg flex-row items-center">
                    <Ionicons name="camera" size={14} color="white" />
                    <Text className="text-white font-medium ml-1 text-xs">Back</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* PAN */}
              <View className="mb-3">
                <Text className="text-xs text-gray-600 mb-1">PAN Card</Text>
                <TouchableOpacity onPress={() => takePhoto('pan')} className="bg-green-600 px-3 py-2 rounded-lg flex-row items-center">
                  <Ionicons name="camera" size={14} color="white" />
                  <Text className="text-white font-medium ml-1 text-xs">PAN</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
      <Animated.View entering={SlideInDown.duration(300)} className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between p-3 border-b border-gray-200">
          <TouchableOpacity onPress={onCancel} className="p-2">
            <Ionicons name="close" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-800">{tenant ? 'Edit Tenant' : 'Add New Tenant'}</Text>
          <TouchableOpacity
            onPress={currentStepIndex === steps.length - 1 ? handleSubmit : nextStep}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg ${isLoading ? 'bg-gray-300' : 'bg-blue-600'}`}
          >
            <Text className={`font-medium ${isLoading ? 'text-gray-500' : 'text-white'}`}>
              {isLoading ? 'Saving...' : currentStepIndex === steps.length - 1 ? 'Save' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View className="p-3 border-b border-gray-200">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm font-medium text-gray-600">
              Step {currentStepIndex + 1} of {steps.length}
            </Text>
            <Text className="text-sm font-medium text-gray-600 capitalize">{currentStep}</Text>
          </View>
          <View className="flex-row space-x-1">
            {steps.map((_, index) => (
              <View
                key={index}
                className={`flex-1 h-2 rounded-full ${index <= currentStepIndex ? 'bg-blue-600' : 'bg-gray-200'}`}
              />
            ))}
          </View>
        </View>

        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <Animated.View entering={FadeInUp.delay(100).duration(300)} className="p-3">
            {renderStepContent()}
          </Animated.View>
        </ScrollView>

        {/* Navigation */}
        {currentStepIndex > 0 && (
          <View className="p-3 border-t border-gray-200">
            <TouchableOpacity onPress={prevStep} className="bg-gray-600 px-4 py-3 rounded-lg">
              <Text className="text-white font-medium text-center">Previous</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Date Pickers */}
        {showStartDatePicker && (
          <DateTimePicker
            value={formData.agreementStart ? new Date(formData.agreementStart) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleStartDateChange}
            minimumDate={new Date()}
            maximumDate={new Date(2030, 11, 31)}
          />
        )}

        {showEndDatePicker && (
          <DateTimePicker
            value={formData.agreementEnd ? new Date(formData.agreementEnd) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleEndDateChange}
            minimumDate={formData.agreementStart ? new Date(formData.agreementStart) : new Date()}
            maximumDate={new Date(2030, 11, 31)}
          />
        )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

export default TenantForm;
