// app/auth/login.tsx
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
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import '../../global.css';
import authApi from '../../services/api/auth.api';
import logger from '../../services/logger/logger.service';
import { LoginCredentials } from '../../types';
import { useAuth } from '../../utils/AuthProvider';

const LoginScreen = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

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
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    logger.userAction('Login button pressed', { email: formData.email });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!formData.email || !formData.password) {
      logger.warn('Login validation failed - missing fields', { hasEmail: !!formData.email, hasPassword: !!formData.password }, 'LoginScreen');
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      logger.warn('Login validation failed - invalid email format', { email: formData.email }, 'LoginScreen');
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
      logger.uiAction('Starting login process', 'LoginScreen', { email: formData.email });
      const response = await authApi.login(formData);

      if (response.success && response.data) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        const userData = {
          id: response.data.id,
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
        };
        
        logger.uiAction('Login successful, showing success toast', 'LoginScreen', { userName: userData.name });
        Toast.show({
          type: 'success',
          text1: 'Login Successful! 🎉',
          text2: `Welcome back, ${userData.name}!`,
          position: 'top',
          visibilityTime: 2000,
        });

        await login(response.data.token, userData);
        
        logger.navigationAction('Navigating to main tabs after successful login', '/(tabs)');
        setTimeout(() => {
          router.replace('/(tabs)');
        }, 500);
      } else {
        throw new Error(response.error || response.message || 'Login failed');
      }
    } catch (err: any) {
      logger.uiError(err, 'LoginScreen', 'Login Process');
      
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
              Get Started With your
            </Text>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Fitness Journey
            </Text>
            <Text className="text-gray-500 text-base mt-1">
              Sign in to your Account
            </Text>
          </View>

          {/* Tab Switcher */}
          <View className="flex-row mb-8 bg-gray-100 rounded-full p-1">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-full ${
                activeTab === 'login' ? 'bg-blue-500' : 'bg-transparent'
              }`}
              onPress={() => {
                setActiveTab('login');
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
                router.push('/auth/signup');
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

          {/* Email Input */}
          <View className="mb-5">
            <Text className="text-gray-700 mb-2 font-medium text-sm">
              Email
            </Text>
            <Animated.View style={{ transform: [{ scale: emailScale }] }}>
              <TextInput
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
                onSubmitEditing={() => passwordInputRef.current?.focus()}
                blurOnSubmit={false}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
              />
            </Animated.View>
          </View>

          {/* Password Input */}
          <View className="mb-3">
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
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
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

          {/* Forgot Password */}
<TouchableOpacity
  className="items-end mb-6"
  onPress={() => {
    router.push('/auth/forgot-password');  // Changed this line
  }}
>
  <Text className="text-blue-500 font-medium text-sm">
    Forgot Password?
  </Text>
</TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            className={`bg-blue-500 py-4 rounded-full shadow-md mb-6 ${
              loading ? 'opacity-70' : 'opacity-100'
            }`}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View className="flex-row justify-center items-center">
                <ActivityIndicator color="white" size="small" />
                <Text className="text-white font-semibold ml-3 text-base">
                  Signing in...
                </Text>
              </View>
            ) : (
              <Text className="text-white font-semibold text-center text-base">
                Login
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
          <View className="flex-row justify-center space-x-4 mb-8">
            <TouchableOpacity
              className="bg-white border border-gray-200 rounded-xl p-4 flex-1 mr-3 shadow-sm"
              onPress={() => {
                Toast.show({
                  type: 'info',
                  text1: 'Coming Soon',
                  text2: 'Google login will be available soon',
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
                  text2: 'Apple login will be available soon',
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

          {/* Sign Up Link */}
          <View className="flex-row justify-center items-center">
            <Text className="text-gray-600 text-sm">
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.push('/auth/signup');
              }}
            >
              <Text className="text-blue-500 font-semibold text-sm">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>

      <Toast />
    </View>
  );
};

export default LoginScreen;