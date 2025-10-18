// app/edit-profile.tsx
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../utils/AuthProvider';
import authApi from '../services/api/auth.api';

const EditProfileScreen = () => {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(user?.avatar || null);

  const pickImage = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Permission Required',
          text2: 'Please allow access to your photo library',
          position: 'top',
        });
        return;
      }

      // Show action sheet
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        Toast.show({
          type: 'success',
          text1: 'Image Selected',
          text2: 'Profile picture updated',
          position: 'top',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to select image',
        position: 'top',
      });
    }
  };

  const takePhoto = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Request permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({
          type: 'error',
          text1: 'Permission Required',
          text2: 'Please allow access to your camera',
          position: 'top',
        });
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        Toast.show({
          type: 'success',
          text1: 'Photo Taken',
          text2: 'Profile picture updated',
          position: 'top',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to take photo',
        position: 'top',
      });
    }
  };

  const showImageOptions = () => {
    Toast.show({
      type: 'info',
      text1: 'Select Image Source',
      text2: 'Choose from library or take a photo',
      position: 'top',
      visibilityTime: 2000,
    });
    
    // You can implement a proper action sheet here
    // For now, we'll default to library
    pickImage();
  };

  const handleUpdateProfile = async () => {
    if (!formData.name.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Name is required',
        position: 'top',
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    if (!formData.phone.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Phone number is required',
        position: 'top',
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    try {
      const profileData = {
        ...formData,
        avatar: selectedImage,
      };
      
      const response = await authApi.updateProfile(profileData);
      updateUser(response.data);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({
        type: 'success',
        text1: 'Profile Updated! 🎉',
        text2: 'Your profile has been updated successfully',
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
        text1: 'Update Failed',
        text2: error.message || 'Failed to update profile',
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
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
          {/* Profile Picture */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: selectedImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&size=200&background=3B82F6&color=fff' }}
                style={styles.avatar}
              />
              <TouchableOpacity 
                style={styles.editAvatarButton}
                onPress={showImageOptions}
                activeOpacity={0.7}
              >
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarText}>Tap to change photo</Text>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter your name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={user?.email || ''}
                editable={false}
                placeholderTextColor="#9CA3AF"
              />
              <Text style={styles.disabledText}>Email cannot be changed</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="Enter your phone number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={handleUpdateProfile}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Updating...' : 'Save Changes'}
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#3B82F6',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  avatarText: {
    fontSize: 14,
    color: '#6B7280',
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
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1F2937',
  },
  disabledInput: {
    backgroundColor: '#F9FAFB',
    color: '#6B7280',
  },
  disabledText: {
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

export default EditProfileScreen;
