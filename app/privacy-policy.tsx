// app/privacy-policy.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PrivacyPolicyScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark" size={60} color="#3B82F6" />
        </View>

        <Text style={styles.lastUpdated}>Last Updated: October 16, 2025</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.sectionText}>
            We collect information you provide directly to us, including your name, email address, 
            phone number, and property details. This information helps us provide better service 
            and manage your rental properties efficiently.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.sectionText}>
            We use the information we collect to operate, maintain, and improve our services. 
            This includes managing your properties, tracking tenants, processing payments, 
            and sending you important notifications about your account.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Data Security</Text>
          <Text style={styles.sectionText}>
            We take reasonable measures to help protect your personal information from loss, 
            theft, misuse, unauthorized access, disclosure, alteration, and destruction. 
            All data is encrypted and stored securely on our servers.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Information Sharing</Text>
          <Text style={styles.sectionText}>
            We do not sell, trade, or rent your personal information to third parties. 
            We may share your information only when required by law or to protect our rights 
            and the safety of our users.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Your Rights</Text>
          <Text style={styles.sectionText}>
            You have the right to access, update, or delete your personal information at any time. 
            You can do this through your account settings or by contacting our support team. 
            You also have the right to opt-out of promotional communications.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Cookies and Tracking</Text>
          <Text style={styles.sectionText}>
            We use cookies and similar tracking technologies to improve your experience 
            and analyze how our services are used. You can control cookie preferences 
            through your device settings.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
          <Text style={styles.sectionText}>
            Our services are not intended for children under 18 years of age. 
            We do not knowingly collect personal information from children. 
            If you believe we have collected information from a child, please contact us immediately.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Changes to Privacy Policy</Text>
          <Text style={styles.sectionText}>
            We may update this Privacy Policy from time to time. We will notify you of any 
            changes by posting the new Privacy Policy on this page and updating the 
            "Last Updated" date.
          </Text>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Contact Us</Text>
          <Text style={styles.contactText}>
            If you have any questions about this Privacy Policy, please contact us at:
          </Text>
          <Text style={styles.contactEmail}>support@roommalik.com</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  lastUpdated: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
  },
  contactSection: {
    marginTop: 10,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 20,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 8,
  },
  contactEmail: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
});

export default PrivacyPolicyScreen;