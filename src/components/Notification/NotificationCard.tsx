/**
 * Notification Card
 * Visual component for a single notification
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ShoppingBag, Tag, Info, Truck } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '@zomato/design-tokens';
import { NotificationItem } from '../../types/notification.types';

interface NotificationCardProps {
    notification: NotificationItem;
    onPress: (notification: NotificationItem) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onPress }) => {
    const getIcon = () => {
        switch (notification.type) {
            case 'ORDER_UPDATE':
                return <ShoppingBag size={20} color={colors.secondary.white} />;
            case 'OFFER':
                return <Tag size={20} color={colors.secondary.white} />;
            case 'DELIVERY':
                return <Truck size={20} color={colors.secondary.white} />;
            case 'SYSTEM':
            default:
                return <Info size={20} color={colors.secondary.white} />;
        }
    };

    const getIconColor = () => {
        switch (notification.type) {
            case 'ORDER_UPDATE':
                return '#2196F3';
            case 'OFFER':
                return colors.semantic.warning;
            case 'DELIVERY':
                return colors.semantic.success;
            case 'SYSTEM':
            default:
                return colors.secondary.gray_500;
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
        padding: spacing.base,
        backgroundColor: colors.secondary.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.gray_100,
    },
    unreadContainer: {
        backgroundColor: colors.primary.zomato_red_light || '#FFF8F9',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
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
        ...typography.body_large,
        color: colors.secondary.gray_900,
        flex: 1,
    },
    unreadText: {
        fontWeight: '700',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary.zomato_red,
        marginLeft: spacing.xs,
    },
    message: {
        ...typography.body_small,
        color: colors.secondary.gray_600,
        marginBottom: spacing.xs,
        lineHeight: 18,
    },
    time: {
        ...typography.caption,
        color: colors.secondary.gray_500,
    },
});

export default NotificationCard;
