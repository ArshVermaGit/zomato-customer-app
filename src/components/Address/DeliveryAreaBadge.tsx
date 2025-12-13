/**
 * DeliveryAreaBadge Component
 * Shows delivery status and estimated time or "We don't deliver here" message
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react-native';
import type { DeliveryAreaInfo } from '../../types/address.types';

interface DeliveryAreaBadgeProps {
    deliveryInfo: DeliveryAreaInfo | null;
    isLoading?: boolean;
}

const DeliveryAreaBadge: React.FC<DeliveryAreaBadgeProps> = ({
    deliveryInfo,
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <View style={[styles.container, styles.loadingContainer]}>
                <Text style={styles.loadingText}>Checking delivery availability...</Text>
            </View>
        );
    }

    if (!deliveryInfo) {
        return null;
    }

    if (deliveryInfo.isDeliverable) {
        return (
            <View style={[styles.container, styles.deliverableContainer]}>
                <CheckCircle size={18} color="#4CAF50" />
                <View style={styles.textContainer}>
                    <Text style={styles.deliverableTitle}>Delivery available</Text>
                    <View style={styles.detailsRow}>
                        <Clock size={14} color="#666" />
                        <Text style={styles.deliveryTime}>
                            {deliveryInfo.estimatedDeliveryTime}
                        </Text>
                        {deliveryInfo.deliveryFee !== undefined && (
                            <Text style={styles.deliveryFee}>
                                • ₹{deliveryInfo.deliveryFee} delivery fee
                            </Text>
                        )}
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, styles.notDeliverableContainer]}>
            <AlertCircle size={18} color="#E23744" />
            <View style={styles.textContainer}>
                <Text style={styles.notDeliverableTitle}>We don't deliver here yet</Text>
                <Text style={styles.notDeliverableMessage}>
                    {deliveryInfo.message || 'Please select a different location'}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 14,
        borderRadius: 10,
        marginVertical: 12,
    },
    loadingContainer: {
        backgroundColor: '#F5F6F8',
        justifyContent: 'center',
    },
    loadingText: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
    deliverableContainer: {
        backgroundColor: '#E8F5E9',
    },
    notDeliverableContainer: {
        backgroundColor: '#FFEBEE',
    },
    textContainer: {
        flex: 1,
        marginLeft: 10,
    },
    deliverableTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4CAF50',
        marginBottom: 4,
    },
    detailsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    deliveryTime: {
        fontSize: 13,
        color: '#666',
        marginLeft: 4,
    },
    deliveryFee: {
        fontSize: 13,
        color: '#666',
        marginLeft: 4,
    },
    notDeliverableTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#E23744',
        marginBottom: 2,
    },
    notDeliverableMessage: {
        fontSize: 13,
        color: '#666',
    },
});

export default DeliveryAreaBadge;
