// app/auth/signup.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../utils/AuthProvider';

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', { // Change to your backend URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, phone }),
      });
      const data = await response.json();
      if (data.success) {
        await login(data.data.token);
        router.replace('/(tabs)'); // Redirect to main tabs
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Signup failed');
    }
  };

  return (
    <View className="flex-1 justify-center p-4 bg-white">
      <Text className="text-2xl font-bold text-center mb-6">Signup for RoomMalik</Text>
      <TextInput
        className="border border-gray-300 p-2 mb-4 rounded"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="border border-gray-300 p-2 mb-4 rounded"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        className="border border-gray-300 p-2 mb-4 rounded"
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        className="border border-gray-300 p-2 mb-4 rounded"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}
      <Button title="Signup" onPress={handleSignup} />
      <TouchableOpacity onPress={() => router.push('/auth/login')}>
        <Text className="text-center text-blue-500 mt-4">Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;