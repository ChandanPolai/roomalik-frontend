// app/auth/login.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../utils/AuthProvider';
import authApi from '../../services/api/auth.api';
import { LoginCredentials } from '../../types';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { LinearGradient } from 'expo-linear-gradient';
import '../../global.css';

const LoginScreen = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { login } = useAuth();
  const router = useRouter();
  const passwordInputRef = useRef<TextInput>(null);

  // Animation values
  const emailScale = useRef(new Animated.Value(1)).current;
  const passwordScale = useRef(new Animated.Value(1)).current;

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError('');
  };

  const handleFocus = (field: string) => {
    setFocusedField(field);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const scale = field === 'email' ? emailScale : passwordScale;
    Animated.spring(scale, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = (field: string) => {
    setFocusedField(null);
    
    const scale = field === 'email' ? emailScale : passwordScale;
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const togglePasswordVisibility = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    // Haptic feedback on button press
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Validation
    if (!formData.email || !formData.password) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fill all fields',
        position: 'top',
        visibilityTime: 3000,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address',
        position: 'top',
        visibilityTime: 3000,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authApi.login(formData);

      if (response.success && response.data) {
        // Success haptic
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
          text1: 'Login Successful! 🎉',
          text2: `Welcome back, ${userData.name}!`,
          position: 'top',
          visibilityTime: 2000,
        });

        await login(response.data.token, userData);
        
        // Small delay to show toast
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 500);
      } else {
        throw new Error(response.error || response.message || 'Login failed');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Error haptic
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center px-6 py-10">
          {/* Header with Icon */}
          <View className="items-center mb-10">
            <View className="bg-blue-500 rounded-full p-6 mb-6 shadow-lg">
              <Ionicons name="home" size={48} color="white" />
            </View>
            <Text className="text-4xl font-bold text-gray-800 mb-2">
              Welcome Back
            </Text>
            <Text className="text-gray-600 text-center text-base">
              Sign in to continue to RoomMalik
            </Text>
          </View>

          {/* Form Container */}
          <View className="bg-white rounded-3xl p-6 shadow-2xl">
            {/* Email Input */}
            <View className="mb-5">
              <Text className="text-gray-700 mb-2 font-semibold text-base">
                Email Address
              </Text>
              <Animated.View style={{ transform: [{ scale: emailScale }] }}>
                <View
                  className={`flex-row items-center border-2 rounded-xl bg-gray-50 px-4 ${
                    focusedField === 'email'
                      ? 'border-blue-500'
                      : 'border-gray-200'
                  }`}
                >
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color={focusedField === 'email' ? '#3B82F6' : '#9CA3AF'}
                  />
                  <TextInput
                    className="flex-1 p-4 text-gray-800 text-base"
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                    blurOnSubmit={false}
                    onFocus={() => handleFocus('email')}
                    onBlur={() => handleBlur('email')}
                  />
                </View>
              </Animated.View>
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-gray-700 mb-2 font-semibold text-base">
                Password
              </Text>
              <Animated.View style={{ transform: [{ scale: passwordScale }] }}>
                <View
                  className={`flex-row items-center border-2 rounded-xl bg-gray-50 px-4 ${
                    focusedField === 'password'
                      ? 'border-blue-500'
                      : 'border-gray-200'
                  }`}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color={focusedField === 'password' ? '#3B82F6' : '#9CA3AF'}
                  />
                  <TextInput
                    ref={passwordInputRef}
                    className="flex-1 p-4 text-gray-800 text-base"
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={formData.password}
                    onChangeText={(value) =>
                      handleInputChange('password', value)
                    }
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                    onSubmitEditing={handleLogin}
                    onFocus={() => handleFocus('password')}
                    onBlur={() => handleBlur('password')}
                  />
                  <TouchableOpacity
                    onPress={togglePasswordVisibility}
                    className="p-2"
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={22}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              className="items-end mb-6"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Toast.show({
                  type: 'info',
                  text1: 'Coming Soon',
                  text2: 'Forgot password feature will be available soon',
                  position: 'top',
                });
              }}
            >
              <Text className="text-blue-500 font-semibold">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              className={`bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-xl shadow-lg mb-4 ${
                loading ? 'opacity-70' : 'opacity-100'
              }`}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <View className="flex-row justify-center items-center">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white font-bold ml-3 text-lg">
                    Signing in...
                  </Text>
                </View>
              ) : (
                <View className="flex-row justify-center items-center">
                  <Text className="text-white font-bold text-lg">
                    Sign In
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="white" className="ml-2" />
                </View>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-4 text-gray-500 font-medium">OR</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Signup Link */}
            <View className="flex-row justify-center items-center">
              <Text className="text-gray-600 text-base">
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/auth/signup');
                }}
              >
                <Text className="text-blue-500 font-bold text-base">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <Text className="text-center text-gray-500 mt-8 text-sm">
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
        </View>
      </KeyboardAwareScrollView>

      {/* Toast Component */}
      <Toast />
    </View>
  );
};

export default LoginScreen;