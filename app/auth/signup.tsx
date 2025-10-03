// app/auth/signup.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../utils/AuthProvider';
import authApi from '../../services/api/auth.api';
import { SignupCredentials } from '../../types';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';
import '../../global.css';

const SignupScreen = () => {
  const [formData, setFormData] = useState<SignupCredentials>({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { login } = useAuth();
  const router = useRouter();

  const emailInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  // Animation values
  const nameScale = useRef(new Animated.Value(1)).current;
  const emailScale = useRef(new Animated.Value(1)).current;
  const phoneScale = useRef(new Animated.Value(1)).current;
  const passwordScale = useRef(new Animated.Value(1)).current;

  const handleInputChange = (field: keyof SignupCredentials, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError('');
  };

  const handleFocus = (field: string) => {
    setFocusedField(field);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    let scale;
    switch (field) {
      case 'name': scale = nameScale; break;
      case 'email': scale = emailScale; break;
      case 'phone': scale = phoneScale; break;
      case 'password': scale = passwordScale; break;
      default: return;
    }
    
    Animated.spring(scale, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = (field: string) => {
    setFocusedField(null);
    
    let scale;
    switch (field) {
      case 'name': scale = nameScale; break;
      case 'email': scale = emailScale; break;
      case 'phone': scale = phoneScale; break;
      case 'password': scale = passwordScale; break;
      default: return;
    }
    
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const togglePasswordVisibility = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowPassword(!showPassword);
  };

  const validateForm = (): boolean => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill all fields',
        position: 'top',
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    if (formData.name.length < 3) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Name',
        text2: 'Name must be at least 3 characters',
        position: 'top',
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address',
        position: 'top',
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    if (formData.phone.length < 10) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Phone',
        text2: 'Please enter a valid 10-digit phone number',
        position: 'top',
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    if (formData.password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Weak Password',
        text2: 'Password must be at least 6 characters',
        position: 'top',
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authApi.register(formData);

      if (response.success && response.data) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Extract user data and token from response
        const userData = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
        };
        
        Toast.show({
          type: 'success',
          text1: 'Account Created! 🎉',
          text2: `Welcome to RoomMalik, ${userData.name}!`,
          position: 'top',
          visibilityTime: 2000,
        });

        await login(response.data.token, userData);
        
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 500);
      } else {
        throw new Error(response.error || response.message || 'Signup failed');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      const errorMessage = err.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const getScaleForField = (field: string) => {
    switch (field) {
      case 'name': return nameScale;
      case 'email': return emailScale;
      case 'phone': return phoneScale;
      case 'password': return passwordScale;
      default: return nameScale;
    }
  };

  const renderInputField = (
    field: keyof SignupCredentials,
    icon: string,
    placeholder: string,
    keyboardType: any = 'default',
    ref?: React.RefObject<TextInput>,
    nextRef?: React.RefObject<TextInput>,
    isPassword = false
  ) => (
    <View className="mb-5">
      <Text className="text-gray-700 mb-2 font-semibold text-base capitalize">
        {field === 'phone' ? 'Phone Number' : field}
      </Text>
      <Animated.View style={{ transform: [{ scale: getScaleForField(field) }] }}>
        <View
          className={`flex-row items-center border-2 rounded-xl bg-gray-50 px-4 ${
            focusedField === field ? 'border-blue-500' : 'border-gray-200'
          }`}
        >
          <Ionicons
            name={icon as any}
            size={20}
            color={focusedField === field ? '#3B82F6' : '#9CA3AF'}
          />
          <TextInput
            ref={ref}
            className="flex-1 p-4 text-gray-800 text-base"
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={formData[field]}
            onChangeText={(value) => handleInputChange(field, value)}
            keyboardType={keyboardType}
            autoCapitalize={field === 'email' ? 'none' : 'words'}
            returnKeyType={nextRef ? 'next' : 'done'}
            onSubmitEditing={() => nextRef ? nextRef.current?.focus() : handleSignup()}
            blurOnSubmit={!nextRef}
            onFocus={() => handleFocus(field)}
            onBlur={() => handleBlur(field)}
            secureTextEntry={isPassword && !showPassword}
          />
          {isPassword && (
            <TouchableOpacity onPress={togglePasswordVisibility} className="p-2">
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  );

  return (
    <View className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-100">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center px-6 py-10">
          {/* Header */}
          <View className="items-center mb-8">
            <View className="bg-indigo-500 rounded-full p-6 mb-6 shadow-lg">
              <Ionicons name="person-add" size={48} color="white" />
            </View>
            <Text className="text-4xl font-bold text-gray-800 mb-2">
              Create Account
            </Text>
            <Text className="text-gray-600 text-center text-base">
              Join RoomMalik and find your perfect room
            </Text>
          </View>

          {/* Form Container */}
          <View className="bg-white rounded-3xl p-6 shadow-2xl">
            {renderInputField('name', 'person-outline', 'Enter your full name', 'default', undefined, emailInputRef)}
            {renderInputField('email', 'mail-outline', 'Enter your email', 'email-address', emailInputRef, phoneInputRef)}
            {renderInputField('phone', 'call-outline', 'Enter your phone number', 'phone-pad', phoneInputRef, passwordInputRef)}
            {renderInputField('password', 'lock-closed-outline', 'Create a password (min 6 chars)', 'default', passwordInputRef, undefined, true)}

            {/* Signup Button */}
            <TouchableOpacity
              className={`bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-xl shadow-lg mb-4 ${
                loading ? 'opacity-70' : 'opacity-100'
              }`}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <View className="flex-row justify-center items-center">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white font-bold ml-3 text-lg">
                    Creating Account...
                  </Text>
                </View>
              ) : (
                <View className="flex-row justify-center items-center">
                  <Text className="text-white font-bold text-lg">
                    Create Account
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </View>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-4 text-gray-500 font-medium">OR</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Login Link */}
            <View className="flex-row justify-center items-center">
              <Text className="text-gray-600 text-base">
                Already have an account?{' '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/auth/login');
                }}
              >
                <Text className="text-indigo-500 font-bold text-base">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <Text className="text-center text-gray-500 mt-8 text-sm">
            By signing up, you agree to our Terms & Privacy Policy
          </Text>
        </View>
      </KeyboardAwareScrollView>

      <Toast />
    </View>
  );
};

export default SignupScreen;