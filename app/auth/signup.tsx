// app/auth/signup.tsx
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import '../../global.css';
import authApi from '../../services/api/auth.api';
import { SignupCredentials } from '../../types';
import { useAuth } from '../../utils/AuthProvider';

const SignupScreen = () => {
  const [formData, setFormData] = useState<SignupCredentials>({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('register');

  const { login } = useAuth();
  const router = useRouter();

  const emailInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  // Animation values
  const nameScale = useRef(new Animated.Value(1)).current;
  const emailScale = useRef(new Animated.Value(1)).current;
  const phoneScale = useRef(new Animated.Value(1)).current;
  const passwordScale = useRef(new Animated.Value(1)).current;
  const confirmPasswordScale = useRef(new Animated.Value(1)).current;

  const handleInputChange = (field: keyof SignupCredentials, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError('');
  };

  const handleFocus = (field: string) => {
    setFocusedField(field);
    
    let scale;
    switch (field) {
      case 'name': scale = nameScale; break;
      case 'email': scale = emailScale; break;
      case 'phone': scale = phoneScale; break;
      case 'password': scale = passwordScale; break;
      case 'confirmPassword': scale = confirmPasswordScale; break;
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
      case 'confirmPassword': scale = confirmPasswordScale; break;
      default: return;
    }
    
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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

    if (formData.password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'Passwords do not match',
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
      case 'confirmPassword': return confirmPasswordScale;
      default: return nameScale;
    }
  };

  return (
    <View className="flex-1 bg-white">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-16 pb-8">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Join RoomMalik
            </Text>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Application
            </Text>
            <Text className="text-gray-500 text-base mt-1">
              Create your account
            </Text>
          </View>

          {/* Tab Switcher */}
          <View className="flex-row mb-8 bg-gray-100 rounded-full p-1">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-full ${
                activeTab === 'login' ? 'bg-blue-500' : 'bg-transparent'
              }`}
              onPress={() => {
                router.push('/auth/login');
              }}
              activeOpacity={0.7}
            >
              <Text
                className={`text-center font-semibold text-base ${
                  activeTab === 'login' ? 'text-white' : 'text-gray-600'
                }`}
              >
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-3 rounded-full ${
                activeTab === 'register' ? 'bg-blue-500' : 'bg-transparent'
              }`}
              onPress={() => {
                setActiveTab('register');
              }}
              activeOpacity={0.7}
            >
              <Text
                className={`text-center font-semibold text-base ${
                  activeTab === 'register' ? 'text-white' : 'text-gray-600'
                }`}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>

          {/* Full Name Input */}
          <View className="mb-5">
            <Text className="text-gray-700 mb-2 font-medium text-sm">
              Full Name
            </Text>
            <Animated.View style={{ transform: [{ scale: nameScale }] }}>
              <TextInput
                className={`bg-gray-50 border ${
                  focusedField === 'name' ? 'border-blue-500' : 'border-gray-200'
                } rounded-xl px-4 py-4 text-gray-800 text-base`}
                placeholder="Fendih Hassan"
                placeholderTextColor="#9CA3AF"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current?.focus()}
                blurOnSubmit={false}
                onFocus={() => handleFocus('name')}
                onBlur={() => handleBlur('name')}
              />
            </Animated.View>
          </View>

          {/* Email Input */}
          <View className="mb-5">
            <Text className="text-gray-700 mb-2 font-medium text-sm">
              Email
            </Text>
            <Animated.View style={{ transform: [{ scale: emailScale }] }}>
              <TextInput
                ref={emailInputRef}
                className={`bg-gray-50 border ${
                  focusedField === 'email' ? 'border-blue-500' : 'border-gray-200'
                } rounded-xl px-4 py-4 text-gray-800 text-base`}
                placeholder="fendihil@gmail.com"
                placeholderTextColor="#9CA3AF"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => phoneInputRef.current?.focus()}
                blurOnSubmit={false}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
              />
            </Animated.View>
          </View>

          {/* Phone Input */}
          <View className="mb-5">
            <Text className="text-gray-700 mb-2 font-medium text-sm">
              Phone Number
            </Text>
            <Animated.View style={{ transform: [{ scale: phoneScale }] }}>
              <TextInput
                ref={phoneInputRef}
                className={`bg-gray-50 border ${
                  focusedField === 'phone' ? 'border-blue-500' : 'border-gray-200'
                } rounded-xl px-4 py-4 text-gray-800 text-base`}
                placeholder="1234567890"
                placeholderTextColor="#9CA3AF"
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                keyboardType="phone-pad"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                blurOnSubmit={false}
                onFocus={() => handleFocus('phone')}
                onBlur={() => handleBlur('phone')}
              />
            </Animated.View>
          </View>

          {/* Password Input */}
          <View className="mb-5">
            <Text className="text-gray-700 mb-2 font-medium text-sm">
              Password
            </Text>
            <Animated.View style={{ transform: [{ scale: passwordScale }] }}>
              <View className="relative">
                <TextInput
                  ref={passwordInputRef}
                  className={`bg-gray-50 border ${
                    focusedField === 'password' ? 'border-blue-500' : 'border-gray-200'
                  } rounded-xl px-4 py-4 text-gray-800 text-base pr-12`}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry={!showPassword}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
                  blurOnSubmit={false}
                  onFocus={() => handleFocus('password')}
                  onBlur={() => handleBlur('password')}
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  className="absolute right-4 top-4"
                  style={{ padding: 4 }}
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

          {/* Confirm Password Input */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-2 font-medium text-sm">
              Confirm Password
            </Text>
            <Animated.View style={{ transform: [{ scale: confirmPasswordScale }] }}>
              <View className="relative">
                <TextInput
                  ref={confirmPasswordInputRef}
                  className={`bg-gray-50 border ${
                    focusedField === 'confirmPassword' ? 'border-blue-500' : 'border-gray-200'
                  } rounded-xl px-4 py-4 text-gray-800 text-base pr-12`}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={(value) => {
                    setConfirmPassword(value);
                    if (error) setError('');
                  }}
                  secureTextEntry={!showConfirmPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleSignup}
                  onFocus={() => handleFocus('confirmPassword')}
                  onBlur={() => handleBlur('confirmPassword')}
                />
                <TouchableOpacity
                  onPress={toggleConfirmPasswordVisibility}
                  className="absolute right-4 top-4"
                  style={{ padding: 4 }}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>

          {/* Create Account Button */}
          <TouchableOpacity
            className={`bg-blue-500 py-4 rounded-full shadow-md mb-6 ${
              loading ? 'opacity-70' : 'opacity-100'
            }`}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View className="flex-row justify-center items-center">
                <ActivityIndicator color="white" size="small" />
                <Text className="text-white font-semibold ml-3 text-base">
                  Creating Account...
                </Text>
              </View>
            ) : (
              <Text className="text-white font-semibold text-center text-base">
                Create account
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-4 text-gray-400 text-sm">or continue with</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          {/* Social Login Buttons */}
          <View className="flex-row justify-center space-x-4">
            <TouchableOpacity
              className="bg-white border border-gray-200 rounded-xl p-4 flex-1 mr-3 shadow-sm"
              onPress={() => {
                Toast.show({
                  type: 'info',
                  text1: 'Coming Soon',
                  text2: 'Google signup will be available soon',
                  position: 'top',
                });
              }}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="logo-google" size={20} color="#DB4437" />
                <Text className="ml-2 text-gray-700 font-medium text-sm">
                  Google
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white border border-gray-200 rounded-xl p-4 flex-1 shadow-sm"
              onPress={() => {
                Toast.show({
                  type: 'info',
                  text1: 'Coming Soon',
                  text2: 'Apple signup will be available soon',
                  position: 'top',
                });
              }}
              activeOpacity={0.7}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="logo-apple" size={20} color="#000" />
                <Text className="ml-2 text-gray-700 font-medium text-sm">
                  Apple
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <Toast />
    </View>
  );
};

export default SignupScreen;