// app/terms-conditions.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TermsConditionsScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="document-text" size={60} color="#3B82F6" />
        </View>

        <Text style={styles.lastUpdated}>Last Updated: October 16, 2025</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.sectionText}>
            By accessing and using Room Malik application, you accept and agree to be bound 
            by the terms and provisions of this agreement. If you do not agree to these terms, 
            please do not use our services.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Use of Service</Text>
          <Text style={styles.sectionText}>
            Room Malik provides a platform for property owners to manage their rental properties, 
            tenants, and finances. You agree to use the service only for lawful purposes and 
            in accordance with these Terms and Conditions.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. User Account</Text>
          <Text style={styles.sectionText}>
            You are responsible for maintaining the confidentiality of your account and password. 
            You agree to accept responsibility for all activities that occur under your account. 
            You must notify us immediately of any unauthorized use of your account.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Data Accuracy</Text>
          <Text style={styles.sectionText}>
            You are responsible for ensuring that all information you provide to Room Malik 
            is accurate, complete, and up-to-date. We are not responsible for any losses 
            arising from inaccurate or incomplete data.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Service Availability</Text>
          <Text style={styles.sectionText}>
            We strive to provide uninterrupted service, but we do not guarantee that the service 
            will be available at all times. We may suspend or terminate service for maintenance, 
            updates, or unforeseen circumstances without prior notice.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Intellectual Property</Text>
          <Text style={styles.sectionText}>
            All content, features, and functionality of Room Malik, including but not limited to 
            text, graphics, logos, and software, are owned by us and protected by copyright, 
            trademark, and other intellectual property laws.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
          <Text style={styles.sectionText}>
            Room Malik shall not be liable for any indirect, incidental, special, consequential, 
            or punitive damages resulting from your use or inability to use the service. 
            We provide the service "as is" without any warranties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Termination</Text>
          <Text style={styles.sectionText}>
            We reserve the right to terminate or suspend your account at any time, without prior 
            notice, for conduct that we believe violates these Terms and Conditions or is harmful 
            to other users, us, or third parties.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Payment Terms</Text>
          <Text style={styles.sectionText}>
            If you subscribe to any paid features, you agree to pay all fees associated with 
            your subscription. All fees are non-refundable unless otherwise stated. 
            We reserve the right to change pricing at any time.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Modifications to Terms</Text>
          <Text style={styles.sectionText}>
            We reserve the right to modify these Terms and Conditions at any time. 
            Your continued use of the service after changes are posted constitutes your 
            acceptance of the modified terms.
          </Text>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Questions?</Text>
          <Text style={styles.contactText}>
            If you have any questions about these Terms and Conditions, please contact us at:
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

export default TermsConditionsScreen;