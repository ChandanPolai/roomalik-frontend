// components/navigation/CustomDrawer.tsx
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_CONFIG } from '../../constants/config';
import { useAuth } from '../../utils/AuthProvider';

const CustomDrawer = (props: any) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Helper function to get full image URL
  const getImageUrl = (url: string) => {
    // If it's already a full URL or local file, return as is
    if (url.startsWith('http') || url.startsWith('file://') || url.startsWith('content://')) {
      return url;
    }
    // Otherwise, prepend the image URL
    return `${API_CONFIG.IMAGE_URL}${url}`;
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    router.replace('/auth/login');
  };

  const menuItems = [
    {
      title: 'Profile',
      icon: 'person-outline',
      onPress: () => {
        props.navigation.closeDrawer();
        props.navigation.navigate('ProfileScreen');
      },
    },
    {
      title: 'Payment',
      icon: 'wallet-outline',
      onPress: () => {
        props.navigation.closeDrawer();
        props.navigation.navigate('PaymentScreen');
      },
    },
  ];

  return (
    <SafeAreaView style={styles.drawerContainer} edges={['bottom']}>
      <DrawerContentScrollView 
        {...props} 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Section - Compact */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image 
                source={{ uri: getImageUrl(user.avatar) }} 
                style={styles.avatar}
              />
            ) : (
              <Ionicons name="person-circle" size={50} color="#3B82F6" />
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.name || 'User'}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user?.email || 'user@example.com'}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.6}
            >
              <Ionicons name={item.icon as any} size={22} color="#3B82F6" />
              <Text style={styles.menuText}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>
      </DrawerContentScrollView>

      {/* Bottom Logout Button - Fixed */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={() => setShowLogoutModal(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIcon}>
              <Ionicons name="log-out" size={36} color="#EF4444" />
            </View>
            
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowLogoutModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: '#6B7280',
  },
  menuContainer: {
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 16,
  },
  logoutContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '600',
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
    width: '85%',
    maxWidth: 320,
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
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default CustomDrawer;