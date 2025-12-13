/**
 * Help & Support Screen
 * FAQ and Contact Options
 */

import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, LayoutAnimation, Platform, UIManager } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, ChevronDown, ChevronUp, MessageCircle, Phone, Mail } from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQS = [
    {
        question: 'Where is my order?',
        answer: 'You can track your order status in real-time from the "My Orders" section or the order tracking screen.',
    },
    {
        question: 'Can I cancel my order?',
        answer: 'Orders can only be cancelled within 60 seconds of placing them. Please contact support immediately if you need assistance.',
    },
    {
        question: 'How do I change my address?',
        answer: 'You can add or edit addresses from the "Address Book" section in your profile.',
    },
    {
        question: 'I found a bug in the app. What do I do?',
        answer: 'Please report it to us via email support@zomato-clone.com with screenshots if possible.',
    },
];

const HelpSupportScreen = () => {
    const navigation = useNavigation();
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleExpand = (index: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help & Support</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.contactSection}>
                    <Text style={styles.sectionTitle}>Contact Us</Text>
                    <View style={styles.contactRow}>
                        <TouchableOpacity style={styles.contactCard}>
                            <MessageCircle size={24} color="#E23744" />
                            <Text style={styles.contactLabel}>Chat</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.contactCard}>
                            <Phone size={24} color="#E23744" />
                            <Text style={styles.contactLabel}>Call</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.contactCard}>
                            <Mail size={24} color="#E23744" />
                            <Text style={styles.contactLabel}>Email</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.faqSection}>
                    <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
                    {FAQS.map((faq, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.faqItem}
                            onPress={() => toggleExpand(index)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.questionRow}>
                                <Text style={styles.question}>{faq.question}</Text>
                                {expandedIndex === index ? (
                                    <ChevronUp size={20} color="#666" />
                                ) : (
                                    <ChevronDown size={20} color="#666" />
                                )}
                            </View>
                            {expandedIndex === index && (
                                <Text style={styles.answer}>{faq.answer}</Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    content: {
        padding: 20,
    },
    contactSection: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
    },
    contactCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    contactLabel: {
        marginTop: 8,
        fontWeight: '600',
        color: '#333',
    },
    faqSection: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        paddingBottom: 8,
    },
    faqItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        marginBottom: 16,
        paddingBottom: 16,
    },
    questionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    question: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    answer: {
        fontSize: 14,
        color: '#666',
        marginTop: 12,
        lineHeight: 20,
    },
});

export default HelpSupportScreen;
