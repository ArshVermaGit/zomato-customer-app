/**
 * Order History Card
 * Displays summary of a past order
 */

import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { ChevronRight, RefreshCw, CheckCircle2, XCircle } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, shadows } from '@zomato/design-tokens';
import { Order, OrderStatus } from '../../types/order.types';

interface OrderHistoryCardProps {
    order: Order;
    onPress: () => void;
    onReorder: () => void;
}

const OrderHistoryCard: React.FC<OrderHistoryCardProps> = ({ order, onPress, onReorder }) => {
    const isDelivered = order.status === OrderStatus.DELIVERED;
    const formattedDate = new Date(order.placedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const itemsSummary = order.items.map(item => `${item.quantity} x ${item.name}`).join(', ');

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            {/* Header: Restaurant & Status */}
            <View style={styles.header}>
                <View style={styles.restaurantInfo}>
                    <Image source={{ uri: order.restaurant.image }} style={styles.image} />
                    <View style={styles.textContainer}>
                        <Text style={styles.restaurantName} numberOfLines={1}>
                            {order.restaurant.name}
                        </Text>
                        <Text style={styles.location} numberOfLines={1}>
                            {order.restaurant.address}
                        </Text>
                    </View>
                </View>
                <View style={[styles.statusBadge, isDelivered ? styles.deliveredBadge : styles.cancelledBadge]}>
                    <Text style={[styles.statusText, isDelivered ? styles.deliveredText : styles.cancelledText]}>
                        {isDelivered ? 'Delivered' : 'Cancelled'}
                    </Text>
                </View>
            </View>

            {/* Content: Items & Price */}
            <View style={styles.content}>
                <Text style={styles.itemsText} numberOfLines={2}>
                    {itemsSummary}
                </Text>
                <Text style={styles.dateText}>{formattedDate}</Text>

                <View style={styles.priceRow}>
                    <Text style={styles.totalLabel}>Total Bill: </Text>
                    <Text style={styles.price}>₹{order.grandTotal}</Text>
                </View>
            </View>

            {/* Footer: Actions */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.reorderButton} onPress={onReorder}>
                    <RefreshCw size={14} color={colors.primary.zomato_red} />
                    <Text style={styles.reorderText}>Reorder</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.detailsButton} onPress={onPress}>
                    <Text style={styles.detailsText}>View Details</Text>
                    <ChevronRight size={14} color={colors.secondary.gray_600} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.secondary.white,
        marginHorizontal: spacing.md,
        marginBottom: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.secondary.gray_200,
        ...shadows.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.gray_100,
    },
    restaurantInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        marginRight: spacing.sm,
        backgroundColor: colors.secondary.gray_100,
    },
    textContainer: {
        flex: 1,
        marginRight: spacing.xs,
    },
    restaurantName: {
        ...typography.body_large,
        fontWeight: '600',
        color: colors.secondary.gray_900,
        marginBottom: 2,
    },
    location: {
        ...typography.caption,
        color: colors.secondary.gray_600,
    },
    statusBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.sm,
    },
    deliveredBadge: {
        backgroundColor: '#E8F5E9',
    },
    cancelledBadge: {
        backgroundColor: '#FFEBEE',
    },
    statusText: {
        ...typography.caption,
        fontWeight: '600',
    },
    deliveredText: {
        color: '#2E7D32',
    },
    cancelledText: {
        color: '#C62828',
    },
    content: {
        padding: spacing.md,
    },
    itemsText: {
        ...typography.body_medium,
        color: colors.secondary.gray_700,
        lineHeight: 18,
        marginBottom: spacing.sm,
    },
    dateText: {
        ...typography.caption,
        color: colors.secondary.gray_500,
        marginBottom: spacing.xs,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    totalLabel: {
        ...typography.body_medium,
        color: colors.secondary.gray_600,
    },
    price: {
        ...typography.body_large,
        fontWeight: '700',
        color: colors.secondary.gray_900,
    },
    footer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: colors.secondary.gray_100,
    },
    reorderButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        borderRightWidth: 1,
        borderRightColor: colors.secondary.gray_100,
        gap: 6,
    },
    reorderText: {
        ...typography.button_small,
        fontWeight: '600',
        color: colors.primary.zomato_red,
    },
    detailsButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        gap: 4,
    },
    detailsText: {
        ...typography.button_small,
        fontWeight: '500',
        color: colors.secondary.gray_600,
    },
});

export default OrderHistoryCard;
