/**
 * Notification Types
 */

export type NotificationType = 'ORDER_UPDATE' | 'OFFER' | 'SYSTEM' | 'DELIVERY';

export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    isRead: boolean;
    timestamp: string;
    data?: {
        orderId?: string;
        offerId?: string;
        url?: string;
    };
}

export interface NotificationChannel {
    id: string;
    name: string;
    importance: number;
}

export interface NotificationState {
    items: NotificationItem[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
    pushToken: string | null;
    permissionStatus: string | null;
}
