/**
 * OrderStatusTimeline Component
 * Vertical timeline showing order status progression
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Check, Circle, Clock } from 'lucide-react-native';
import type { OrderTimelineEvent } from '../../types/order.types';
import { OrderStatusInfo } from '../../types/order.types';
import { OrderTrackingService } from '../../services/orderTracking.service';

interface OrderStatusTimelineProps {
    timeline: OrderTimelineEvent[];
}

const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({ timeline }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Order Status</Text>
            <View style={styles.timeline}>
                {timeline.map((event, index) => (
                    <TimelineItem
                        key={event.status}
                        event={event}
                        isLast={index === timeline.length - 1}
                    />
                ))}
            </View>
        </View>
    );
};

interface TimelineItemProps {
    event: OrderTimelineEvent;
    isLast: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ event, isLast }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const statusInfo = OrderStatusInfo[event.status];

    useEffect(() => {
        if (event.isCurrent) {
            const pulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.2,
                        duration: 600,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 600,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                ])
            );
            pulse.start();
            return () => pulse.stop();
        }
    }, [event.isCurrent, pulseAnim]);

    const renderIcon = () => {
        if (event.isCompleted) {
            return (
                <View style={[styles.iconContainer, styles.completedIcon]}>
                    <Check size={14} color="#fff" strokeWidth={3} />
                </View>
            );
        }

        if (event.isCurrent) {
            return (
                <Animated.View
                    style={[
                        styles.iconContainer,
                        styles.currentIcon,
                        { transform: [{ scale: pulseAnim }] },
                    ]}
                >
                    <View style={styles.currentDot} />
                </Animated.View>
            );
        }

        return (
            <View style={[styles.iconContainer, styles.pendingIcon]}>
                <Circle size={8} color="#ccc" />
            </View>
        );
    };

    return (
        <View style={styles.itemContainer}>
            {/* Timeline Line */}
            <View style={styles.lineContainer}>
                {renderIcon()}
                {!isLast && (
                    <View
                        style={[
                            styles.line,
                            event.isCompleted && styles.completedLine,
                        ]}
                    />
                )}
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
                <Text
                    style={[
                        styles.statusLabel,
                        event.isCompleted && styles.completedLabel,
                        event.isCurrent && styles.currentLabel,
                    ]}
                >
                    {statusInfo.label}
                </Text>
                <Text style={styles.statusDescription}>{statusInfo.description}</Text>
                {event.timestamp && (
                    <View style={styles.timeContainer}>
                        <Clock size={12} color="#666" />
                        <Text style={styles.timeText}>
                            {OrderTrackingService.formatTime(event.timestamp)}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
    },
    timeline: {
        paddingLeft: 4,
    },
    itemContainer: {
        flexDirection: 'row',
        minHeight: 70,
    },
    lineContainer: {
        alignItems: 'center',
        width: 28,
    },
    iconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    completedIcon: {
        backgroundColor: '#4CAF50',
    },
    currentIcon: {
        backgroundColor: '#E23744',
    },
    currentDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#fff',
    },
    pendingIcon: {
        backgroundColor: '#F5F6F8',
        borderWidth: 2,
        borderColor: '#E0E0E0',
    },
    line: {
        flex: 1,
        width: 2,
        backgroundColor: '#E0E0E0',
        marginVertical: 4,
    },
    completedLine: {
        backgroundColor: '#4CAF50',
    },
    contentContainer: {
        flex: 1,
        marginLeft: 12,
        paddingBottom: 16,
    },
    statusLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#999',
        marginBottom: 2,
    },
    completedLabel: {
        color: '#4CAF50',
    },
    currentLabel: {
        color: '#E23744',
    },
    statusDescription: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    timeText: {
        fontSize: 11,
        color: '#666',
        marginLeft: 4,
    },
});

export default OrderStatusTimeline;
