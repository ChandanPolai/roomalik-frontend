// app/auth/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../utils/AuthProvider';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch('https://4f4598x0-5000.inc1.devtunnels.ms/api/auth/login', { // Change to your backend URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        await login(data.data.token);
        router.replace('/(tabs)'); // Redirect to main tabs
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <View className="flex-1 justify-center p-4 bg-white">
      <Text className="text-2xl font-bold text-center mb-6">Login to RoomMalik</Text>
      <TextInput
        className="border border-gray-300 p-2 mb-4 rounded"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        className="border border-gray-300 p-2 mb-4 rounded"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
      <TouchableOpacity onPress={() => router.push('/auth/signup')}>
        <Text className="text-center text-blue-500 mt-4">Don't have an account? Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;