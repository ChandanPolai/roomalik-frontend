// app/profile.tsx
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useAuth } from '../utils/AuthProvider';

const ProfileScreen = ({ navigation }: any) => {
  const { logout, user } = useAuth();
  const router = useRouter();

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

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Toast.show({
      type: 'info',
      text1: 'Logout Confirmation',
      text2: 'Are you sure you want to logout?',
      position: 'top',
      visibilityTime: 3000,
      onPress: async () => {
        try {
          await logout();
          router.replace('/auth/login');
          Toast.show({
            type: 'success',
            text1: 'Logged Out',
            text2: 'You have been logged out successfully',
            position: 'top',
          });
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: 'Logout Failed',
            text2: 'Failed to logout. Please try again.',
            position: 'top',
          });
        }
      }
    });
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
      </SafeAreaView>

      {/* Content */}
      <SafeAreaView style={styles.contentSafeArea}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: user?.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&size=200&background=3B82F6&color=fff' }}
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

          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* App Version */}
          <Text style={styles.appVersion}>Version 1.0.0</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  logoutButton: {
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
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginLeft: 8,
  },
  appVersion: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 20,
  },
});

export default ProfileScreen;