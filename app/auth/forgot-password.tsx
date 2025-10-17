// app/auth/forgot-password.tsx
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

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const router = useRouter();
  const newPasswordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  // Animation values
  const emailScale = useRef(new Animated.Value(1)).current;
  const newPasswordScale = useRef(new Animated.Value(1)).current;
  const confirmPasswordScale = useRef(new Animated.Value(1)).current;

  const handleFocus = (field: string) => {
    setFocusedField(field);
    const scale = 
      field === 'email' ? emailScale : 
      field === 'newPassword' ? newPasswordScale : 
      confirmPasswordScale;
    
    Animated.spring(scale, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = (field: string) => {
    setFocusedField(null);
    const scale = 
      field === 'email' ? emailScale : 
      field === 'newPassword' ? newPasswordScale : 
      confirmPasswordScale;
    
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleResetPassword = async () => {
    logger.userAction('Reset password button pressed', { email });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Validation
    if (!email || !newPassword || !confirmPassword) {
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
    if (!emailRegex.test(email)) {
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

    if (newPassword.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Password Too Short',
        text2: 'Password must be at least 6 characters',
        position: 'top',
        visibilityTime: 3000,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Passwords Do Not Match',
        text2: 'Please make sure both passwords match',
        position: 'top',
        visibilityTime: 3000,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);

    try {
      logger.uiAction('Starting reset password process', 'ForgotPasswordScreen', { email });
      const response = await authApi.resetPassword({ email, newPassword });

      if (response.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        Toast.show({
          type: 'success',
          text1: 'Password Reset Successful! ✅',
          text2: 'You can now login with your new password',
          position: 'top',
          visibilityTime: 3000,
        });

        logger.uiAction('Password reset successful, navigating to login', 'ForgotPasswordScreen');
        
        setTimeout(() => {
          router.replace('/auth/login');
        }, 1500);
      } else {
        throw new Error(response.error || response.message || 'Password reset failed');
      }
    } catch (err: any) {
      logger.uiError(err, 'ForgotPasswordScreen', 'Reset Password Process');
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      const errorMessage = err.message || 'Password reset failed. Please try again.';
      
      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
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
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => router.back()}
            className="mb-8 flex-row items-center"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#3B82F6" />
            <Text className="text-blue-500 font-semibold text-base ml-2">
              Back to Login
            </Text>
          </TouchableOpacity>

          {/* Header */}
          <View className="mb-8">
            <View className="bg-blue-100 w-16 h-16 rounded-full items-center justify-center mb-4">
              <Ionicons name="lock-closed" size={32} color="#3B82F6" />
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Reset Password
            </Text>
            <Text className="text-gray-500 text-base mt-1">
              Enter your email and create a new password
            </Text>
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
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => newPasswordInputRef.current?.focus()}
                blurOnSubmit={false}
                onFocus={() => handleFocus('email')}
                onBlur={() => handleBlur('email')}
              />
            </Animated.View>
          </View>

          {/* New Password Input */}
          <View className="mb-5">
            <Text className="text-gray-700 mb-2 font-medium text-sm">
              New Password
            </Text>
            <Animated.View style={{ transform: [{ scale: newPasswordScale }] }}>
              <View className="relative">
                <TextInput
                  ref={newPasswordInputRef}
                  className={`bg-gray-50 border ${
                    focusedField === 'newPassword' ? 'border-blue-500' : 'border-gray-200'
                  } rounded-xl px-4 py-4 text-gray-800 text-base pr-12`}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
                  blurOnSubmit={false}
                  onFocus={() => handleFocus('newPassword')}
                  onBlur={() => handleBlur('newPassword')}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-4"
                  style={{ padding: 4 }}
                >
                  <Ionicons
                    name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
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
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleResetPassword}
                  onFocus={() => handleFocus('confirmPassword')}
                  onBlur={() => handleBlur('confirmPassword')}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
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

          {/* Reset Button */}
          <TouchableOpacity
            className={`bg-blue-500 py-4 rounded-full shadow-md mb-6 ${
              loading ? 'opacity-70' : 'opacity-100'
            }`}
            onPress={handleResetPassword}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <View className="flex-row justify-center items-center">
                <ActivityIndicator color="white" size="small" />
                <Text className="text-white font-semibold ml-3 text-base">
                  Resetting...
                </Text>
              </View>
            ) : (
              <Text className="text-white font-semibold text-center text-base">
                Reset Password
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>

      <Toast />
    </View>
  );
};

export default ForgotPasswordScreen;