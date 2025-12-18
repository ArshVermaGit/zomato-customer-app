/**
 * Notification Service
 * Handles local notifications and mock remote push logic
 * Note: Notifee requires native code, so we mock for Expo Go
 */

import { NotificationItem } from '../types/notification.types';

const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(() => resolve(true), ms));

// Mock Data
let MOCK_NOTIFICATIONS: NotificationItem[] = [
    {
        id: 'n_1',
        title: 'Order Delivered',
        message: 'Your order from Punjab Grill has been delivered. Enjoy your meal!',
        type: 'ORDER_UPDATE',
        isRead: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        data: { orderId: 'o_123' }
    },
    {
        id: 'n_2',
        title: '50% Off via Zomato Gold',
        message: 'Get flat 50% off on your next order. Valid till Sunday.',
        type: 'OFFER',
        isRead: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        data: { offerId: 'o_2' }
    }
];

export const NotificationService = {
    requestPermission: async () => 1,
    createChannels: async () => { },
    displayLocalNotification: async (title: string, body: string, data?: any) => {
        console.log('[Mock Notification]', title, body);
    },
    getNotifications: async (): Promise<NotificationItem[]> => {
        await mockDelay();
        return [...MOCK_NOTIFICATIONS].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    },
    markAsRead: async (id: string) => {
        await mockDelay(200);
        const index = MOCK_NOTIFICATIONS.findIndex(n => n.id === id);
        if (index !== -1) MOCK_NOTIFICATIONS[index].isRead = true;
        return [...MOCK_NOTIFICATIONS];
    },
    markAllAsRead: async () => {
        await mockDelay(500);
        MOCK_NOTIFICATIONS = MOCK_NOTIFICATIONS.map(n => ({ ...n, isRead: true }));
        return [...MOCK_NOTIFICATIONS];
    },
    deleteNotification: async (id: string) => {
        await mockDelay(200);
        const index = MOCK_NOTIFICATIONS.findIndex(n => n.id === id);
        if (index !== -1) MOCK_NOTIFICATIONS.splice(index, 1);
        return [...MOCK_NOTIFICATIONS];
    }
};
