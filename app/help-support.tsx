// app/help-support.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HelpSupportScreen = () => {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleEmail = () => {
    Linking.openURL('mailto:support@roommalik.com');
  };

  const handlePhone = () => {
    Linking.openURL('tel:+917069472565');
  };

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/7069472565');
  };

  const toggleFaq = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const faqData = [
    {
      question: 'How do I add a new property?',
      answer: 'Go to the Plots screen and tap on the "+" button at the bottom right. Fill in all the required details and save.',
    },
    {
      question: 'How can I manage my tenants?',
      answer: 'Navigate to the Tenants section from the bottom tab. Here you can view, add, edit, or remove tenant information.',
    },
    {
      question: 'How do I track rent payments?',
      answer: 'Visit the Payment section to view all rent payment history, pending payments, and generate receipts.',
    },
    {
      question: 'Can I upload multiple images for a room?',
      answer: 'Yes! When adding or editing a room, you can upload multiple images to showcase different angles and features.',
    },
    {
      question: 'How do I get notified about due payments?',
      answer: 'Enable notifications in your device settings. The app will automatically send alerts for upcoming and overdue payments.',
    },
    {
      question: 'Can I export my financial reports?',
      answer: 'Yes, you can generate and export monthly/yearly financial reports from the Reports section.',
    },
  ];

  return (
    <View style={styles.mainContainer}>
      {/* Header with SafeArea */}
      <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
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
          <View style={styles.iconContainer}>
            <Ionicons name="help-circle" size={60} color="#3B82F6" />
          </View>

          <Text style={styles.subtitle}>We're here to help you!</Text>

          {/* Contact Options */}
          <View style={styles.contactOptions}>
            <TouchableOpacity style={styles.contactCard} onPress={handleEmail}>
              <View style={styles.contactIcon}>
                <Ionicons name="mail" size={24} color="#3B82F6" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Email Us</Text>
                <Text style={styles.contactValue}>support@roommalik.com</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactCard} onPress={handlePhone}>
              <View style={styles.contactIcon}>
                <Ionicons name="call" size={24} color="#10B981" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>Call Us</Text>
                <Text style={styles.contactValue}>+91 98765 43210</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactCard} onPress={handleWhatsApp}>
              <View style={styles.contactIcon}>
                <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactLabel}>WhatsApp</Text>
                <Text style={styles.contactValue}>Chat with us</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* FAQ Section */}
          <View style={styles.faqSection}>
            <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
            
            {faqData.map((faq, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.faqCard,
                  expandedIndex === index && styles.faqCardExpanded
                ]}
                onPress={() => toggleFaq(index)}
                activeOpacity={0.7}
              >
                <View style={styles.faqHeader}>
                  <Ionicons 
                    name="help-circle-outline" 
                    size={20} 
                    color="#3B82F6" 
                  />
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Ionicons 
                    name={expandedIndex === index ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#6B7280" 
                  />
                </View>
                {expandedIndex === index && (
                  <View style={styles.faqAnswerContainer}>
                    <Text style={styles.faqAnswer}>{faq.answer}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Support Hours */}
          <View style={styles.supportHours}>
            <Text style={styles.supportTitle}>Support Hours</Text>
            <View style={styles.hoursRow}>
              <Ionicons name="time-outline" size={20} color="#6B7280" />
              <Text style={styles.hoursText}>Monday - Friday: 9:00 AM - 6:00 PM</Text>
            </View>
            <View style={styles.hoursRow}>
              <Ionicons name="time-outline" size={20} color="#6B7280" />
              <Text style={styles.hoursText}>Saturday: 10:00 AM - 4:00 PM</Text>
            </View>
            <View style={styles.hoursRow}>
              <Ionicons name="time-outline" size={20} color="#6B7280" />
              <Text style={styles.hoursText}>Sunday: Closed</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  contactOptions: {
    marginBottom: 24,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  faqSection: {
    marginBottom: 24,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  faqCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  faqCardExpanded: {
    backgroundColor: '#FFFFFF',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
    marginRight: 8,
  },
  faqAnswerContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  faqAnswer: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    paddingLeft: 28,
  },
  supportHours: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  supportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hoursText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
});

export default HelpSupportScreen;