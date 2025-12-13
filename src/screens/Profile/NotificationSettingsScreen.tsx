/**
 * Notification Settings Screen
 * Toggle preferences for notifications
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft } from 'lucide-react-native';

import { RootState, AppDispatch } from '../../store/store';
import { updateSettings } from '../../store/slices/authSlice';

const NotificationSettingsScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const { settings } = useSelector((state: RootState) => state.auth);

    const toggleSwitch = (key: keyof typeof settings) => {
        dispatch(updateSettings({ [key]: !settings[key] }));
    };

    const SettingRow = ({ label, description, valueKey }: { label: string, description?: string, valueKey: keyof typeof settings }) => (
        <View style={styles.row}>
            <View style={styles.textContainer}>
                <Text style={styles.label}>{label}</Text>
                {description && <Text style={styles.description}>{description}</Text>}
            </View>
            <Switch
                trackColor={{ false: '#E0E0E0', true: '#FFCDD2' }}
                thumbColor={settings[valueKey] ? '#E23744' : '#f4f3f4'}
                ios_backgroundColor="#E0E0E0"
                onValueChange={() => toggleSwitch(valueKey)}
                value={settings[valueKey]}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionHeader}>Order Options</Text>
                <SettingRow
                    label="Order Updates"
                    description="Get updates on your order status"
                    valueKey="orderUpdates"
                />

                <Text style={styles.sectionHeader}>Offers</Text>
                <SettingRow
                    label="Offers & Promotions"
                    description="Receive coupons and exclusive deals"
                    valueKey="offersAndPromos"
                />

                <Text style={styles.sectionHeader}>Communication Channels</Text>
                <SettingRow
                    label="Push Notifications"
                    valueKey="pushNotifications"
                />
                <SettingRow
                    label="Email"
                    valueKey="emailNotifications"
                />
                <SettingRow
                    label="SMS"
                    valueKey="smsNotifications"
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
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
    sectionHeader: {
        fontSize: 14,
        fontWeight: '700',
        color: '#999',
        marginBottom: 16,
        marginTop: 16,
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    textContainer: {
        flex: 1,
        paddingRight: 16,
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        color: '#666',
    },
});

export default NotificationSettingsScreen;
