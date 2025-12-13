/**
 * Profile Screen
 * Main profile menu and user info
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
    ChevronRight,
    User,
    ShoppingBag,
    MapPin,
    CreditCard,
    Heart,
    Tag,
    Gift,
    Bell,
    HelpCircle,
    Info,
    LogOut
} from 'lucide-react-native';

import { RootState, AppDispatch } from '../../store/store';
import { fetchProfile, logout } from '../../store/slices/authSlice';

const ProfileScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch<AppDispatch>();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

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
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Auth' }], // Assuming Auth stack exists or reset to splash
                        });
                    }
                },
            ]
        );
    };

    const MenuItem = ({ icon, label, onPress, showBorder = true }: { icon: any, label: string, onPress: () => void, showBorder?: boolean }) => (
        <TouchableOpacity style={[styles.menuItem, !showBorder && styles.noBorder]} onPress={onPress}>
            <View style={styles.menuIconContainer}>
                {icon}
            </View>
            <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{label}</Text>
                <ChevronRight size={20} color="#ccc" />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.profileInfo}>
                        <View style={styles.avatarContainer}>
                            {user?.avatar ? (
                                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                            ) : (
                                <View style={styles.placeholderAvatar}>
                                    <User size={32} color="#999" />
                                </View>
                            )}
                            <TouchableOpacity
                                style={styles.editButton}
                                onPress={() => navigation.navigate('EditProfile')}
                            >
                                <Text style={styles.editButtonText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
                            <Text style={styles.userDetails}>{user?.phone}</Text>
                            <Text style={styles.userDetails}>{user?.email}</Text>
                        </View>
                    </View>
                </View>

                {/* Menu Groups */}
                <View style={styles.section}>
                    <MenuItem
                        icon={<ShoppingBag size={20} color="#333" />}
                        label="Your Orders"
                        onPress={() => navigation.navigate('OrderHistory')}
                    />
                    <MenuItem
                        icon={<MapPin size={20} color="#333" />}
                        label="Address Book"
                        onPress={() => navigation.navigate('AddressList')}
                    />
                    <MenuItem
                        icon={<Heart size={20} color="#333" />}
                        label="Favorites"
                        onPress={() => navigation.navigate('Favorites')}
                    />
                    <MenuItem
                        icon={<CreditCard size={20} color="#333" />}
                        label="Payment Methods"
                        onPress={() => { }} // Placeholder
                        showBorder={false}
                    />
                </View>

                <View style={styles.section}>
                    <MenuItem
                        icon={<Tag size={20} color="#333" />}
                        label="Offers & Promos"
                        onPress={() => navigation.navigate('Offers')}
                    />
                    <MenuItem
                        icon={<Gift size={20} color="#333" />}
                        label="Refer & Earn"
                        onPress={() => navigation.navigate('ReferEarn')}
                    />
                    <MenuItem
                        icon={<Bell size={20} color="#333" />}
                        label="Notifications"
                        onPress={() => navigation.navigate('NotificationSettings')}
                        showBorder={false}
                    />
                </View>

                <View style={styles.section}>
                    <MenuItem
                        icon={<HelpCircle size={20} color="#333" />}
                        label="Help & Support"
                        onPress={() => navigation.navigate('HelpSupport')}
                    />
                    <MenuItem
                        icon={<Info size={20} color="#333" />}
                        label="About"
                        onPress={() => navigation.navigate('About')}
                    />
                    <TouchableOpacity style={[styles.menuItem, styles.noBorder]} onPress={handleLogout}>
                        <View style={styles.menuIconContainer}>
                            <LogOut size={20} color="#E23744" />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={[styles.menuLabel, styles.logoutText]}>Logout</Text>
                        </View>
                    </TouchableOpacity>
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
        backgroundColor: '#FAFAFA',
    },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F0F0F0',
    },
    placeholderAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButton: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingVertical: 4,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        height: 24, // Crop to bottom half roughly
        overflow: 'hidden', // Hacky simple overlay. Better to have a separate badge.
        // Let's change to a badge style
        display: 'none', // Removing the overlay style for now, switching to a button below or separate
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    userDetails: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    section: {
        backgroundColor: '#fff',
        marginBottom: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#F0F0F0',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    menuIconContainer: {
        width: 40,
        alignItems: 'center',
    },
    menuContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        paddingBottom: 16,
        marginBottom: -16, // To align border with text only? No, standard full width items usually.
        // Let's simplify border logic
        // Actually, let's remove border from here and put it on a wrapper if needed or rely on item separator
    },
    menuLabel: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    noBorder: {
        borderBottomWidth: 0,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 10,
        textAlign: 'center',
    },
    logoutText: {
        color: '#E23744',
    },
    versionText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 12,
        marginTop: 10,
        marginBottom: 20,
    },
});

export default ProfileScreen;
