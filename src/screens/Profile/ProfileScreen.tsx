/**
 * Profile Screen
 * Main profile menu and user info
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
    ShoppingBag,
    MapPin,
    Heart,
    CreditCard,
    Tag,
    Gift,
    Bell,
    HelpCircle,
    Info,
    LogOut,
    Settings
} from 'lucide-react-native';
import { colors, spacing, typography } from '@zomato/design-tokens';

import { RootState, AppDispatch } from '../../store/store';
import { fetchProfile, logout } from '../../store/slices/authSlice';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileMenuItem from '../../components/Profile/ProfileMenuItem';

const ProfileScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(fetchProfile());
    }, []);

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: () => {
                        dispatch(logout());
                        // Assuming navigation reset is handled by root navigator based on auth state,
                        // but explicitly navigating here just in case.
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Auth' }],
                        });
                    }
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                <ProfileHeader
                    user={user}
                    onEditPress={() => navigation.navigate('EditProfile')}
                />

                {/* FOOD ORDERS */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>FOOD ORDERS</Text>
                </View>
                <View style={styles.section}>
                    <ProfileMenuItem
                        icon={<ShoppingBag size={20} color={colors.secondary.black} />}
                        label="Your Orders"
                        onPress={() => navigation.navigate('OrderHistory')}
                    />
                    <ProfileMenuItem
                        icon={<Heart size={20} color={colors.secondary.black} />}
                        label="Favorite Orders"
                        onPress={() => navigation.navigate('Favorites')}
                    />
                    <ProfileMenuItem
                        icon={<MapPin size={20} color={colors.secondary.black} />}
                        label="Address Book"
                        onPress={() => navigation.navigate('AddressList')}
                    />
                    <ProfileMenuItem
                        icon={<Settings size={20} color={colors.secondary.black} />}
                        label="Hidden Restaurants"
                        onPress={() => { }}
                        showBorder={false}
                    />
                </View>

                {/* MONEY */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>MONEY</Text>
                </View>
                <View style={styles.section}>
                    <ProfileMenuItem
                        icon={<CreditCard size={20} color={colors.secondary.black} />}
                        label="Payments"
                        onPress={() => { }}
                    />
                    <ProfileMenuItem
                        icon={<Gift size={20} color={colors.secondary.black} />}
                        label="Zomato Credits"
                        onPress={() => { }}
                        showBorder={false}
                    />
                </View>


                {/* MORE */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>MORE</Text>
                </View>
                <View style={styles.section}>
                    <ProfileMenuItem
                        icon={<Tag size={20} color={colors.secondary.black} />}
                        label="Offers"
                        onPress={() => navigation.navigate('Offers')}
                    />
                    <ProfileMenuItem
                        icon={<Gift size={20} color={colors.secondary.black} />}
                        label="Refer & Earn"
                        onPress={() => navigation.navigate('ReferEarn')}
                    />
                    <ProfileMenuItem
                        icon={<Bell size={20} color={colors.secondary.black} />}
                        label="Notification Preferences"
                        onPress={() => navigation.navigate('NotificationSettings')}
                    />
                    <ProfileMenuItem
                        icon={<HelpCircle size={20} color={colors.secondary.black} />}
                        label="Help & Support"
                        onPress={() => navigation.navigate('HelpSupport')}
                    />
                    <ProfileMenuItem
                        icon={<Info size={20} color={colors.secondary.black} />}
                        label="About"
                        onPress={() => navigation.navigate('About')}
                        showBorder={false}
                    />
                </View>

                <View style={styles.section}>
                    <ProfileMenuItem
                        icon={<LogOut size={20} color={colors.primary.zomato_red} />}
                        label="Log Out"
                        onPress={handleLogout}
                        isDestructive
                        showBorder={false}
                    />
                </View>

                <Text style={styles.versionText}>App Version 1.0.0</Text>
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.gray_50,
    },
    scrollContent: {
        paddingBottom: spacing.xl,
    },
    sectionHeader: {
        paddingHorizontal: spacing.base,
        paddingBottom: spacing.sm,
        paddingTop: spacing.md,
    },
    sectionTitle: {
        ...typography.overline,
        color: colors.secondary.gray_600,
    },
    section: {
        backgroundColor: colors.secondary.white,
        marginBottom: spacing.sm,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.secondary.gray_200,
    },
    versionText: {
        textAlign: 'center',
        ...typography.caption,
        color: colors.secondary.gray_500,
        marginTop: spacing.lg,
        marginBottom: spacing.xl,
    },
});

export default ProfileScreen;
