/**
 * OrderMiniPlayer Component
 * Collapsed tracking bar showing order status at bottom of screen
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { ChevronUp, Clock } from 'lucide-react-native';
import type { Order } from '../../services/api/api.types';
import { OrderStatus, OrderStatusInfo } from '../../services/api/api.types';
import { OrderTrackingService } from '../../services/orderTracking.service';

interface OrderMiniPlayerProps {
    order: Order;
    onExpand: () => void;
}

const OrderMiniPlayer: React.FC<OrderMiniPlayerProps> = ({ order, onExpand }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Pulsing dot animation
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.3,
                    duration: 800,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();

        return () => pulse.stop();
    }, [pulseAnim]);

    const statusInfo = (OrderStatusInfo as any)[order.status] || (OrderStatusInfo as any)['PLACED'];
    const etaText = OrderTrackingService.getEstimatedTimeRemaining(order);

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onExpand}
            activeOpacity={0.95}
        >
            <View style={styles.content}>
                {/* Pulsing Dot */}
                <Animated.View
                    style={[
                        styles.pulsingDot,
                        { transform: [{ scale: pulseAnim }] },
                    ]}
                />

                {/* Order Info */}
                <View style={styles.orderInfo}>
                    <Text style={styles.restaurantName} numberOfLines={1}>
                        {order.restaurant?.name || 'Restaurant'}
                    </Text>
                    <Text style={styles.statusText} numberOfLines={1}>
                        {statusInfo.label}
                    </Text>
                </View>

                {/* ETA */}
                <View style={styles.etaContainer}>
                    <Clock size={14} color="#fff" />
                    <Text style={styles.etaText}>{etaText}</Text>
                </View>

                {/* Expand Icon */}
                <ChevronUp size={22} color="#fff" />
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View
                    style={[
                        styles.progressBar,
                        { width: `${getProgressPercentage(order.status)}%` }
                    ]}
                />
            </View>
        </TouchableOpacity>
    );
};

const getProgressPercentage = (status: OrderStatus): number => {
    const progressMap: Record<string, number> = {
        ['PLACED']: 15,
        ['ACCEPTED']: 30,
        ['PREPARING']: 50,
        ['READY']: 70,
        ['OUT_FOR_DELIVERY']: 85,
        ['DELIVERED']: 100,
    };
    return progressMap[status] || 0;
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#E23744',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    pulsingDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4CAF50',
        marginRight: 12,
    },
    orderInfo: {
        flex: 1,
        marginRight: 12,
    },
    restaurantName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
    statusText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 2,
    },
    etaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.15)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 14,
        marginRight: 12,
    },
    etaText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 4,
    },
    progressContainer: {
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#fff',
    },
});

export default OrderMiniPlayer;
