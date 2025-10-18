// app/change-password.tsx
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import authApi from '../services/api/auth.api';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChangePasswordScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChangePassword = async () => {
    if (!formData.currentPassword.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Current password is required',
        position: 'top',
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!formData.newPassword.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'New password is required',
        position: 'top',
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (formData.newPassword.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'New password must be at least 6 characters long',
        position: 'top',
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'New passwords do not match',
        position: 'top',
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'New password must be different from current password',
        position: 'top',
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({
        type: 'success',
        text1: 'Password Changed! 🔒',
        text2: 'Your password has been updated successfully',
        position: 'top',
        visibilityTime: 2000,
      });
      
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show({
        type: 'error',
        text1: 'Change Failed',
        text2: error.message || 'Failed to change password',
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Change Password</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

      {/* Content */}
      <SafeAreaView style={styles.contentSafeArea}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Security Icon */}
          <View style={styles.iconSection}>
            <View style={styles.iconContainer}>
              <Ionicons name="shield-checkmark" size={60} color="#3B82F6" />
            </View>
            <Text style={styles.iconText}>Update your password</Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={formData.currentPassword}
                  onChangeText={(text) => setFormData({ ...formData, currentPassword: text })}
                  placeholder="Enter current password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPasswords.current}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => togglePasswordVisibility('current')}
                >
                  <Ionicons 
                    name={showPasswords.current ? "eye-off" : "eye"} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={formData.newPassword}
                  onChangeText={(text) => setFormData({ ...formData, newPassword: text })}
                  placeholder="Enter new password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPasswords.new}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => togglePasswordVisibility('new')}
                >
                  <Ionicons 
                    name={showPasswords.new ? "eye-off" : "eye"} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.helpText}>Password must be at least 6 characters long</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm New Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                  placeholder="Confirm new password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPasswords.confirm}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => togglePasswordVisibility('confirm')}
                >
                  <Ionicons 
                    name={showPasswords.confirm ? "eye-off" : "eye"} 
                    size={20} 
                    color="#6B7280" 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={handleChangePassword}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Updating...' : 'Change Password'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
      
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#3B82F6',
  },
  headerSafeArea: {
    backgroundColor: '#3B82F6',
  },
  contentSafeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  formSection: {
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeButton: {
    padding: 4,
  },
  helpText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ChangePasswordScreen;
