/**
 * Notifications Screen
 * List of all user notifications
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, BellOff, CheckCheck } from 'lucide-react-native';

import { RootState, AppDispatch } from '../../store/store';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../../store/slices/notificationSlice';
import { NotificationItem, NotificationType } from '../../types/notification.types';
import NotificationCard from '../../components/Notification/NotificationCard';

const NotificationsScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch<AppDispatch>();
    const { items, isLoading } = useSelector((state: RootState) => state.notification);

    const [activeTab, setActiveTab] = useState<'ALL' | 'ORDER' | 'OFFER'>('ALL');

    useEffect(() => {
        dispatch(fetchNotifications());
    }, []);

    const handlePress = (notification: NotificationItem) => {
        if (!notification.isRead) {
            dispatch(markNotificationRead(notification.id));
        }

        // Deep linking logic
        if (notification.type === 'ORDER_UPDATE' && notification.data?.orderId) {
            navigation.navigate('OrderDetails', { orderId: notification.data.orderId });
        } else if (notification.type === 'OFFER') {
            navigation.navigate('Offers');
        }
    };

    const handleMarkAllRead = () => {
        Alert.alert(
            'Mark all as read',
            'Are you sure?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Yes', onPress: () => dispatch(markAllNotificationsRead()) }
            ]
        );
    };

    const filteredItems = items.filter(item => {
        if (activeTab === 'ALL') return true;
        if (activeTab === 'ORDER') return item.type === 'ORDER_UPDATE';
        if (activeTab === 'OFFER') return item.type === 'OFFER';
        return true;
    });

    const TabButton = ({ title, tab }: { title: string, tab: typeof activeTab }) => (
        <TouchableOpacity
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
        >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <ChevronLeft size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notifications</Text>
                </View>
                <TouchableOpacity onPress={handleMarkAllRead} style={styles.readAllButton}>
                    <CheckCheck size={20} color="#E23744" />
                </TouchableOpacity>
            </View>

            <View style={styles.tabsContainer}>
                <TabButton title="All" tab="ALL" />
                <TabButton title="Orders" tab="ORDER" />
                <TabButton title="Offers" tab="OFFER" />
            </View>

            <FlatList
                data={filteredItems}
                renderItem={({ item }) => <NotificationCard notification={item} onPress={handlePress} />}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={() => dispatch(fetchNotifications())} colors={['#E23744']} />
                }
                ListEmptyComponent={() => (
                    <View style={styles.emptyState}>
                        <BellOff size={64} color="#E0E0E0" />
                        <Text style={styles.emptyTitle}>No Notifications</Text>
                        <Text style={styles.emptySubtitle}>You're all caught up! Check back later for updates.</Text>
                    </View>
                )}
            />
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
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 4,
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    readAllButton: {
        padding: 8,
    },
    tabsContainer: {
        flexDirection: 'row',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    tab: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: '#F5F5F5',
    },
    activeTab: {
        backgroundColor: '#333',
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666',
    },
    activeTabText: {
        color: '#fff',
    },
    listContent: {
        flexGrow: 1,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        padding: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginTop: 8,
    },
});

export default NotificationsScreen;
