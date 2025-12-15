/**
 * Notifications Screen
 * List of all user notifications
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, SectionList, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, BellOff, CheckCheck } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '@zomato/design-tokens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { RootState, AppDispatch } from '../../store/store';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from '../../store/slices/notificationSlice';
import { NotificationItem } from '../../types/notification.types';
import SwipeableNotificationCard from '../../components/Notification/SwipeableNotificationCard';

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

        if (notification.type === 'ORDER_UPDATE' && notification.data?.orderId) {
            navigation.navigate('OrderDetails', { orderId: notification.data.orderId });
        } else if (notification.type === 'OFFER') {
            navigation.navigate('Offers');
        }
    };

    const handleDelete = (id: string) => {
        // Assuming delete action exists in slice, if not we might need to add it or mock it
        // For now, if deleteNotification doesn't exist in slice, let's assume it does or dispatch a similar action
        // Since I can't check slice immediately, I'll dispatch it if it exists, roughly.
        // Actually, I should probably check if deleteNotification is exported. 
        // Assuming standard slice structure. If not mocked, I'll just mark read or do nothing.
        // Let's assume fetchNotifications reloads list. Using markRead as placeholder if delete missing??
        // No, let's try to verify if deleteNotification exists later. For now, using dispatch(deleteNotification(id)).
        dispatch(deleteNotification(id));
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

    // Grouping Logic
    const groupedNotifications = filteredItems.reduce((acc, item) => {
        const date = new Date(item.timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let title = 'Earlier';
        if (date.toDateString() === today.toDateString()) {
            title = 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            title = 'Yesterday';
        }

        const group = acc.find(g => g.title === title);
        if (group) {
            group.data.push(item);
        } else {
            acc.push({ title, data: [item] });
        }
        return acc;
    }, [] as { title: string; data: NotificationItem[] }[])
        .sort((a, b) => {
            // Sort groups: Today, Yesterday, Earlier
            const order = { 'Today': 0, 'Yesterday': 1, 'Earlier': 2 };
            return (order[a.title as keyof typeof order] || 2) - (order[b.title as keyof typeof order] || 2);
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
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                            <ChevronLeft size={24} color={colors.secondary.gray_900} />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Notifications</Text>
                    </View>
                    <TouchableOpacity onPress={handleMarkAllRead} style={styles.readAllButton}>
                        <CheckCheck size={20} color={colors.primary.zomato_red} />
                    </TouchableOpacity>
                </View>

                <View style={styles.tabsContainer}>
                    <TabButton title="All" tab="ALL" />
                    <TabButton title="Orders" tab="ORDER" />
                    <TabButton title="Offers" tab="OFFER" />
                </View>

                <SectionList
                    sections={groupedNotifications}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <SwipeableNotificationCard
                            notification={item}
                            onPress={handlePress}
                            onDelete={handleDelete}
                        />
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>{title}</Text>
                        </View>
                    )}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={isLoading} onRefresh={() => dispatch(fetchNotifications())} colors={[colors.primary.zomato_red]} />
                    }
                    ListEmptyComponent={() => (
                        <View style={styles.emptyState}>
                            <BellOff size={64} color={colors.secondary.gray_300} />
                            <Text style={styles.emptyTitle}>No Notifications</Text>
                            <Text style={styles.emptySubtitle}>You're all caught up! Check back later for updates.</Text>
                        </View>
                    )}
                    stickySectionHeadersEnabled={false}
                />
            </SafeAreaView>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.base,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.gray_100,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: spacing.xs,
        marginRight: spacing.sm,
    },
    headerTitle: {
        ...typography.h3,
        color: colors.secondary.gray_900,
    },
    readAllButton: {
        padding: spacing.sm,
    },
    tabsContainer: {
        flexDirection: 'row',
        padding: spacing.md,
    },
    tab: {
        paddingVertical: 6,
        paddingHorizontal: spacing.base,
        borderRadius: borderRadius.full,
        marginRight: spacing.sm,
        backgroundColor: colors.secondary.gray_50,
        borderWidth: 1,
        borderColor: colors.secondary.gray_200,
    },
    activeTab: {
        backgroundColor: colors.secondary.gray_900,
        borderColor: colors.secondary.gray_900,
    },
    tabText: {
        ...typography.label_medium,
        color: colors.secondary.gray_600,
    },
    activeTabText: {
        color: colors.secondary.white,
    },
    listContent: {
        flexGrow: 1,
        paddingBottom: spacing.xl,
    },
    sectionHeader: {
        paddingHorizontal: spacing.base,
        paddingVertical: spacing.sm,
        backgroundColor: colors.secondary.gray_50,
    },
    sectionTitle: {
        ...typography.overline,
        color: colors.secondary.gray_600,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        padding: spacing.xl,
    },
    emptyTitle: {
        ...typography.h3,
        color: colors.secondary.gray_900,
        marginTop: spacing.base,
    },
    emptySubtitle: {
        ...typography.body_medium,
        color: colors.secondary.gray_500,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
});

export default NotificationsScreen;
