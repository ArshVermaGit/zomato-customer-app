/**
 * OrderItemsSummary Component
 * Collapsible section showing order items
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ChevronDown, ChevronUp, Circle } from 'lucide-react-native';
import type { OrderItem } from '../../types/order.types';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface OrderItemsSummaryProps {
    items: OrderItem[];
}

const OrderItemsSummary: React.FC<OrderItemsSummaryProps> = ({ items }) => {
    const [expanded, setExpanded] = useState(false);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const toggleExpanded = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.header} onPress={toggleExpanded} activeOpacity={0.7}>
                <View style={styles.headerLeft}>
                    <Text style={styles.title}>Order Items</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{totalItems}</Text>
                    </View>
                </View>
                {expanded ? (
                    <ChevronUp size={20} color="#666" />
                ) : (
                    <ChevronDown size={20} color="#666" />
                )}
            </TouchableOpacity>

            {expanded && (
                <View style={styles.itemsContainer}>
                    {items.map((item) => (
                        <View key={item.id} style={styles.itemRow}>
                            <View style={styles.itemLeft}>
                                <View style={[styles.vegIndicator, !item.isVeg && styles.nonVegIndicator]}>
                                    <Circle size={6} color={item.isVeg ? '#4CAF50' : '#E23744'} fill={item.isVeg ? '#4CAF50' : '#E23744'} />
                                </View>
                                <Text style={styles.itemName}>{item.name}</Text>
                            </View>
                            <View style={styles.itemRight}>
                                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                                <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    badge: {
        backgroundColor: '#E23744',
        minWidth: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        paddingHorizontal: 6,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
    },
    itemsContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F6F8',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    vegIndicator: {
        width: 16,
        height: 16,
        borderWidth: 1.5,
        borderColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    nonVegIndicator: {
        borderColor: '#E23744',
    },
    itemName: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemQuantity: {
        fontSize: 13,
        color: '#666',
        marginRight: 12,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        minWidth: 50,
        textAlign: 'right',
    },
});

export default OrderItemsSummary;
