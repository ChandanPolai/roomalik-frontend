// app/profile.tsx
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { API_CONFIG } from '../constants/config';
import { useAuth } from '../utils/AuthProvider';

const ProfileScreen = ({ navigation }: any) => {
  const { logout, user } = useAuth();
  const router = useRouter();

  // Helper function to get full image URL
  const getImageUrl = (url: string) => {
    // If it's already a full URL or local file, return as is
    if (url.startsWith('http') || url.startsWith('file://') || url.startsWith('content://')) {
      return url;
    }
    // Otherwise, prepend the image URL
    return `${API_CONFIG.IMAGE_URL}${url}`;
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      subtitle: 'Update your personal information',
      color: '#3B82F6',
      onPress: () => navigation.navigate('EditProfileScreen'),
    },
    {
      icon: 'key-outline',
      title: 'Change Password',
      subtitle: 'Update your password',
      color: '#10B981',
      onPress: () => navigation.navigate('ChangePasswordScreen'),
    },
  ];

  const supportItems = [
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      onPress: () => navigation.navigate('HelpSupportScreen'),
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Privacy Policy',
      onPress: () => navigation.navigate('PrivacyPolicyScreen'),
    },
    {
      icon: 'document-text-outline',
      title: 'Terms & Conditions',
      onPress: () => navigation.navigate('TermsConditionsScreen'),
    },
  ];

  const handleDeleteAccount = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Toast.show({
      type: 'error',
      text1: 'Delete Account',
      text2: 'Contact admin to delete your account',
      position: 'top',
      visibilityTime: 4000,
      onPress: () => {
        // Show modal with admin contact info
        setShowDeleteModal(true);
      }
    });
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <View style={styles.mainContainer}>
      {/* Header with SafeArea */}
      <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

      {/* Content Area */}
      <SafeAreaView style={styles.contentSafeArea} edges={['left', 'right', 'bottom']}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: user?.avatar ? getImageUrl(user.avatar) : 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&size=200&background=3B82F6&color=fff' }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.userName}>{user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            <Text style={styles.memberSince}>Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}</Text>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Account</Text>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}15` }]}>
                  <Ionicons name={item.icon as any} size={24} color={item.color} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Support Section */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Support</Text>
            {supportItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View style={styles.menuIconContainer}>
                  <Ionicons name={item.icon as any} size={24} color="#6B7280" />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Delete Account Button */}
          <TouchableOpacity 
            style={styles.deleteAccountButton}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={24} color="#EF4444" />
            <Text style={styles.deleteAccountText}>Delete Account</Text>
          </TouchableOpacity>

          {/* App Version */}
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
      
      {/* Delete Account Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIcon}>
              <Ionicons name="warning" size={32} color="#EF4444" />
            </View>
            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalMessage}>
              To delete your account, please contact the administrator:
            </Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email:</Text>
              <Text style={styles.contactValue}>admin@roomalik.com</Text>
              <Text style={styles.contactLabel}>Phone:</Text>
              <Text style={styles.contactValue}>+1 (555) 123-4567</Text>
            </View>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowDeleteModal(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
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
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#3B82F6',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  memberSince: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  menuSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  deleteAccountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  contactInfo: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    color: '#3B82F6',
    marginBottom: 12,
  },
  modalButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  appVersion: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 20,
  },
});

export default ProfileScreen;