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
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../utils/AuthProvider';
import authApi from '../../services/api/auth.api';
import { LoginCredentials } from '../../types';
import '../../global.css';

const LoginScreen = () => {
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();
  const passwordInputRef = useRef<TextInput>(null);

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user types
    if (error) setError('');
  };

  const handleLogin = async () => {
    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authApi.login(formData);

      if (response.success && response.data.token) {
        await login(response.data.token, response.data.user);
        router.replace('/(tabs)');
      } else {
        setError(response.error || response.message || 'Login failed');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-white"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingVertical: 40,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6">
            {/* Header */}
            <View className="items-center mb-10">
              <Text className="text-4xl font-bold text-gray-800 mb-2">
                Welcome Back
              </Text>
              <Text className="text-gray-500 text-center text-base">
                Login to your RoomMalik account
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              {/* Email Input */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Email</Text>
                <TextInput
                  className="border border-gray-300 p-4 rounded-xl bg-gray-50 text-gray-800"
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                  blurOnSubmit={false}
                />
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Password</Text>
                <TextInput
                  ref={passwordInputRef}
                  className="border border-gray-300 p-4 rounded-xl bg-gray-50 text-gray-800"
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
              </View>

              {/* Error Message */}
              {error ? (
                <View className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <Text className="text-red-600 text-center">{error}</Text>
                </View>
              ) : null}

              {/* Login Button */}
              <TouchableOpacity
                className={`bg-blue-500 p-4 rounded-xl shadow-lg mt-6 ${
                  loading ? 'opacity-70' : 'opacity-100'
                }`}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <View className="flex-row justify-center items-center">
                    <ActivityIndicator color="white" size="small" />
                    <Text className="text-white font-semibold ml-2 text-lg">
                      Logging in...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white text-center font-semibold text-lg">
                    Login
                  </Text>
                )}
              </TouchableOpacity>

              {/* Signup Link */}
              <View className="flex-row justify-center mt-6">
                <Text className="text-gray-600">Don&apos;t have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/auth/signup')}>
                  <Text className="text-blue-500 font-semibold">Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;