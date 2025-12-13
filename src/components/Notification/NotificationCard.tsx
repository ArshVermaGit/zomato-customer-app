/**
 * Notification Card
 * Visual component for a single notification
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShoppingBag, Tag, Info, Truck } from 'lucide-react-native';
import { NotificationItem, NotificationType } from '../../types/notification.types';

interface NotificationCardProps {
    notification: NotificationItem;
    onPress: (notification: NotificationItem) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onPress }) => {
    const getIcon = () => {
        switch (notification.type) {
            case 'ORDER_UPDATE':
                return <ShoppingBag size={20} color="#fff" />;
            case 'OFFER':
                return <Tag size={20} color="#fff" />;
            case 'DELIVERY':
                return <Truck size={20} color="#fff" />;
            case 'SYSTEM':
            default:
                return <Info size={20} color="#fff" />;
        }
    };

    const getIconColor = () => {
        switch (notification.type) {
            case 'ORDER_UPDATE':
                return '#2196F3'; // Blue
            case 'OFFER':
                return '#FF9800'; // Orange
            case 'DELIVERY':
                return '#4CAF50'; // Green
            case 'SYSTEM':
            default:
                return '#9E9E9E'; // Grey
        }
    };

    const getTimeAgo = (timestamp: string) => {
        const diff = Date.now() - new Date(timestamp).getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };

    return (
        <TouchableOpacity
            style={[styles.container, !notification.isRead && styles.unreadContainer]}
            onPress={() => onPress(notification)}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: getIconColor() }]}>
                {getIcon()}
            </View>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.title, !notification.isRead && styles.unreadText]} numberOfLines={1}>
                        {notification.title}
                    </Text>
                    {!notification.isRead && <View style={styles.dot} />}
                </View>
                <Text style={styles.message} numberOfLines={2}>
                    {notification.message}
                </Text>
                <Text style={styles.time}>{getTimeAgo(notification.timestamp)}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    unreadContainer: {
        backgroundColor: '#FFF8F9', // Slight tint for unread
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    unreadText: {
        fontWeight: '700',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E23744',
        marginLeft: 8,
    },
    message: {
        fontSize: 13,
        color: '#666',
        marginBottom: 6,
        lineHeight: 18,
    },
    time: {
        fontSize: 11,
        color: '#999',
    },
});

export default NotificationCard;
