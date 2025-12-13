/**
 * Order History Card
 * Displays summary of a past order
 */

import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { ChevronRight, RefreshCw, CheckCircle2, XCircle } from 'lucide-react-native';
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
                    <RefreshCw size={14} color="#E23744" />
                    <Text style={styles.reorderText}>Reorder</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.detailsButton} onPress={onPress}>
                    <Text style={styles.detailsText}>View Details</Text>
                    <ChevronRight size={14} color="#666" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    restaurantInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 8,
        marginRight: 10,
        backgroundColor: '#F0F0F0',
    },
    textContainer: {
        flex: 1,
        marginRight: 8,
    },
    restaurantName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    location: {
        fontSize: 12,
        color: '#888',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    deliveredBadge: {
        backgroundColor: '#E8F5E9',
    },
    cancelledBadge: {
        backgroundColor: '#FFEBEE',
    },
    statusText: {
        fontSize: 11,
        fontWeight: '500',
    },
    deliveredText: {
        color: '#2E7D32',
    },
    cancelledText: {
        color: '#C62828',
    },
    content: {
        padding: 12,
    },
    itemsText: {
        fontSize: 13,
        color: '#555',
        lineHeight: 18,
        marginBottom: 8,
    },
    dateText: {
        fontSize: 11,
        color: '#999',
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 13,
        color: '#666',
    },
    price: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
    },
    footer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#F5F5F5',
    },
    reorderButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRightWidth: 1,
        borderRightColor: '#F5F5F5',
        gap: 6,
    },
    reorderText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#E23744',
    },
    detailsButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        gap: 4,
    },
    detailsText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#666',
    },
});

export default OrderHistoryCard;
