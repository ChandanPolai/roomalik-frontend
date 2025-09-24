import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React from 'react';
import "../../global.css";

const LoginScreen = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white p-4">
      {/* Header */}
      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</Text>
        <Text className="text-gray-600">Sign in to continue</Text>
      </View>
      
      {/* Form Container */}
      <View className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg">
        {/* Email Field */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-2 font-medium">Email</Text>
          <TextInput
            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900"
            placeholder="Enter your email"
            placeholderTextColor="#A0AEC0"
            keyboardType="email-address"
          />
        </View>

        {/* Password Field */}
        <View className="mb-6">
          <Text className="text-gray-700 mb-2 font-medium">Password</Text>
          <TextInput
            className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 text-gray-900"
            placeholder="Enter your password"
            placeholderTextColor="#A0AEC0"
            secureTextEntry
          />
        </View>
        
        {/* Forgot Password */}
        <TouchableOpacity className="mb-6">
          <Text className="text-blue-600 text-right font-medium">Forgot Password?</Text>
        </TouchableOpacity>
        
        {/* Login Button */}
        <TouchableOpacity className="w-full bg-blue-600 p-4 rounded-lg mb-4">
          <Text className="text-white text-center text-lg font-semibold">Login</Text>
        </TouchableOpacity>
      </View>
      
      {/* Sign Up Link */}
      <View className="mt-6 flex-row">
        <Text className="text-gray-600">Dont have an account?</Text>
        <Text className="text-blue-600 font-semibold ml-1">Sign Up</Text>
      </View>
    </View>
  );
};

export default LoginScreen;