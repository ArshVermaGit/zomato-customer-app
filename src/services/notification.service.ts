/**
 * Notification Service
 * Handles local notifications and mock remote push logic using Notifee
 */

import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { NotificationItem, NotificationType } from '../types/notification.types';

const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(() => resolve(true), ms));

// Mock Data
let MOCK_NOTIFICATIONS: NotificationItem[] = [
    {
        id: 'n_1',
        title: 'Order Delivered',
        message: 'Your order from Punjab Grill has been delivered. Enjoy your meal!',
        type: 'ORDER_UPDATE',
        isRead: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        data: { orderId: 'o_123' }
    },
    {
        id: 'n_2',
        title: '50% Off via Zomato Gold',
        message: 'Get flat 50% off on your next order. Valid till Sunday.',
        type: 'OFFER',
        isRead: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        data: { offerId: 'o_2' }
    },
    {
        id: 'n_3',
        title: 'Refund Processed',
        message: 'Refund of ₹140 for your cancelled order has been initiated.',
        type: 'SYSTEM',
        isRead: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    }
];

export const NotificationService = {
    /**
     * Request permissions
     */
    requestPermission: async () => {
        const settings = await notifee.requestPermission();
        return settings.authorizationStatus; // 1 = Authorized
    },

    /**
     * Register channels (Android)
     */
    createChannels: async () => {
        await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
            importance: AndroidImportance.HIGH,
        });
        await notifee.createChannel({
            id: 'orders',
            name: 'Order Updates',
            importance: AndroidImportance.HIGH,
            sound: 'default',
        });
    },

    /**
     * Display a local notification
     */
    displayLocalNotification: async (title: string, body: string, data?: any) => {
        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
        });

        // Display a notification
        await notifee.displayNotification({
            title,
            body,
            data,
            android: {
                channelId,
                // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'
                pressAction: {
                    id: 'default',
                },
            },
        });
    },

    /**
     * Get notification history (Mock)
     */
    getNotifications: async (): Promise<NotificationItem[]> => {
        await mockDelay();
        // Sort by date desc
        return [...MOCK_NOTIFICATIONS].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },

    /**
     * Mark as read
     */
    markAsRead: async (id: string) => {
        await mockDelay(200);
        const index = MOCK_NOTIFICATIONS.findIndex(n => n.id === id);
        if (index !== -1) {
            MOCK_NOTIFICATIONS[index].isRead = true;
        }
        return [...MOCK_NOTIFICATIONS];
    },

    /**
     * Mark all as read
     */
    markAllAsRead: async () => {
        await mockDelay(500);
        MOCK_NOTIFICATIONS = MOCK_NOTIFICATIONS.map(n => ({ ...n, isRead: true }));
        return [...MOCK_NOTIFICATIONS];
    },

    /**
     * Delete notification
     */
    deleteNotification: async (id: string) => {
        await mockDelay(200);
        const index = MOCK_NOTIFICATIONS.findIndex(n => n.id === id);
        if (index !== -1) {
            MOCK_NOTIFICATIONS.splice(index, 1);
        }
        return [...MOCK_NOTIFICATIONS];
    }
};

// Background event handler (must be registered in index.js usually, but putting here for reference)
notifee.onBackgroundEvent(async ({ type, detail }) => {
    // const { notification, pressAction } = detail;
    // Handle background events
});
