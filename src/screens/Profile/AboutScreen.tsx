/**
 * About Screen
 * Legal info and app version
 */

import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const AboutScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>About</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.logoSection}>
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoText}>Z</Text>
                    </View>
                    <Text style={styles.appName}>Zomato</Text>
                    <Text style={styles.version}>Version 1.0.0 (Build 100)</Text>
                </View>

                <View style={styles.menuGroup}>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuLabel}>Terms of Service</Text>
                        <ChevronRight size={20} color="#ccc" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuLabel}>Privacy Policy</Text>
                        <ChevronRight size={20} color="#ccc" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuLabel}>Open Source Licenses</Text>
                        <ChevronRight size={20} color="#ccc" />
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Made with ❤️ for foodies</Text>
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
        padding: 24,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    logoPlaceholder: {
        width: 80,
        height: 80,
        backgroundColor: '#E23744',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    logoText: {
        fontSize: 48,
        fontWeight: '900',
        color: '#fff',
        fontStyle: 'italic',
    },
    appName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    version: {
        fontSize: 14,
        color: '#999',
    },
    menuGroup: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    menuLabel: {
        fontSize: 16,
        color: '#333',
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
    },
    footerText: {
        color: '#999',
        fontSize: 12,
    },
});

export default AboutScreen;
