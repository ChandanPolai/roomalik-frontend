// app/auth/signup.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../utils/AuthProvider';
import authApi from '../../services/api/auth.api';
import { SignupCredentials } from '../../types';
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

  const { login } = useAuth();
  const router = useRouter();

  const scrollViewRef = useRef<ScrollView>(null);
  const emailInputRef = useRef<TextInput>(null) as React.RefObject<TextInput>;
  const phoneInputRef = useRef<TextInput>(null) as React.RefObject<TextInput>;
  const passwordInputRef = useRef<TextInput>(null) as React.RefObject<TextInput>;

  const handleInputChange = (field: keyof SignupCredentials, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user types
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill all fields');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }

    // Phone validation (basic)
    if (formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }

    // Password validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authApi.register(formData);

      if (response.success && response.data.token) {
        await login(response.data.token, response.data.user);
        router.replace('/(tabs)');
      } else {
        setError(response.error || response.message || 'Signup failed');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const focusNextField = (nextRef: React.RefObject<TextInput>, offset: number = 50) => {
    nextRef.current?.focus();
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: offset, animated: true });
    }, 100);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-white"
      >
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingVertical: 40,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-6">
            {/* Header */}
            <View className="items-center mb-8">
              <Text className="text-3xl font-bold text-gray-800 mb-2">
                Join RoomMalik
              </Text>
              <Text className="text-gray-500 text-center">
                Create your account and find your perfect room
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              {/* Name Input */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Full Name</Text>
                <TextInput
                  className="border border-gray-300 p-4 rounded-xl bg-gray-50 text-gray-800"
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  returnKeyType="next"
                  onSubmitEditing={() => focusNextField(emailInputRef, 120)}
                  blurOnSubmit={false}
                />
              </View>

              {/* Email Input */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Email</Text>
                <TextInput
                  ref={emailInputRef}
                  className="border border-gray-300 p-4 rounded-xl bg-gray-50 text-gray-800"
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => focusNextField(phoneInputRef, 200)}
                  blurOnSubmit={false}
                />
              </View>

              {/* Phone Input */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Phone Number</Text>
                <TextInput
                  ref={phoneInputRef}
                  className="border border-gray-300 p-4 rounded-xl bg-gray-50 text-gray-800"
                  placeholder="Enter your phone number"
                  placeholderTextColor="#9CA3AF"
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  keyboardType="phone-pad"
                  returnKeyType="next"
                  onSubmitEditing={() => focusNextField(passwordInputRef, 280)}
                  blurOnSubmit={false}
                />
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-gray-700 mb-2 font-medium">Password</Text>
                <TextInput
                  ref={passwordInputRef}
                  className="border border-gray-300 p-4 rounded-xl bg-gray-50 text-gray-800"
                  placeholder="Create a password (min 6 characters)"
                  placeholderTextColor="#9CA3AF"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  secureTextEntry
                  returnKeyType="done"
                  onSubmitEditing={handleSignup}
                />
              </View>

              {/* Error Message */}
              {error ? (
                <View className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <Text className="text-red-600 text-center">{error}</Text>
                </View>
              ) : null}

              {/* Signup Button */}
              <TouchableOpacity
                className={`bg-blue-500 p-4 rounded-xl shadow-lg mt-6 ${
                  loading ? 'opacity-70' : 'opacity-100'
                }`}
                onPress={handleSignup}
                disabled={loading}
              >
                {loading ? (
                  <View className="flex-row justify-center items-center">
                    <ActivityIndicator color="white" size="small" />
                    <Text className="text-white font-semibold ml-2 text-lg">
                      Creating Account...
                    </Text>
                  </View>
                ) : (
                  <Text className="text-white text-center font-semibold text-lg">
                    Create Account
                  </Text>
                )}
              </TouchableOpacity>

              {/* Login Link */}
              <View className="flex-row justify-center mt-6">
                <Text className="text-gray-600">Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push('/auth/login')}>
                  <Text className="text-blue-500 font-semibold">Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default SignupScreen;