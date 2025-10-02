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
  TouchableWithoutFeedback
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../utils/AuthProvider';

const SignupScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();
  
  const scrollViewRef = useRef<ScrollView>(null);
  const emailInputRef = useRef<TextInput>(null);
  const phoneInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignup = async () => {
    // Reset error
    setError('');
    
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Sending signup request...', formData);
      
      const response = await fetch('https://4f4598x0-5000.inc1.devtunnels.ms/api/auth/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      
      const responseText = await response.text();
      console.log('Response text:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error('Invalid server response');
      }

      console.log('Parsed data:', data);

      if (response.ok && data.success) {
        console.log('Signup successful, logging in...');
        await login(data.data.token);
        router.replace('/(tabs)');
      } else {
        setError(data.error || data.message || 'Signup failed');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message || 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const focusNextField = (nextRef: React.RefObject<TextInput>, offset: number = 50) => {
    nextRef.current?.focus();
    // Scroll to make sure the input is visible
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
            paddingVertical: 40 
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
                  placeholder="Create a password"
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