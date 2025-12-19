/**
 * OrderCompletedModal Component
 * Success screen with celebration animation
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Star, FileText, RefreshCw, X } from 'lucide-react-native';
import type { Order } from '../../services/api/api.types';

interface OrderCompletedModalProps {
    visible: boolean;
    order: Order;
    onClose: () => void;
    onViewReceipt: () => void;
    onReorder: () => void;
}

const OrderCompletedModal: React.FC<OrderCompletedModalProps> = ({
    visible,
    order,
    onClose,
    onViewReceipt,
    onReorder,
}) => {
    const navigation = useNavigation<any>(); // Using any for simplicity here to access Root navigator

    const handleRateOrder = () => {
        onClose();
        navigation.navigate('RateOrder', { orderId: order.id });
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Close Button */}
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <X size={24} color="#666" />
                </TouchableOpacity>

                {/* Celebration */}
                <View style={styles.celebrationContainer}>
                    <Image
                        source={{
                            uri: 'https://cdn-icons-png.flaticon.com/512/2550/2550249.png',
                        }}
                        style={styles.celebrationImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Thank You */}
                <Text style={styles.title}>Order Delivered!</Text>
                <Text style={styles.subtitle}>
                    Your order from {order.restaurant?.name} has been delivered successfully.
                </Text>

                {/* Order Summary */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Order ID</Text>
                        <Text style={styles.summaryValue}>{order.orderNumber}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Amount</Text>
                        <Text style={styles.summaryValue}>₹{order.grandTotal}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Items</Text>
                        <Text style={styles.summaryValue}>
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                        </Text>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.primaryButton} onPress={handleRateOrder}>
                        <Star size={20} color="#fff" />
                        <Text style={styles.primaryButtonText}>Rate Your Order</Text>
                    </TouchableOpacity>

                    <View style={styles.secondaryActions}>
                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={onViewReceipt}
                        >
                            <FileText size={18} color="#E23744" />
                            <Text style={styles.secondaryButtonText}>View Receipt</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={onReorder}
                        >
                            <RefreshCw size={18} color="#E23744" />
                            <Text style={styles.secondaryButtonText}>Reorder</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tip Prompt */}
                <View style={styles.tipPrompt}>
                    <Text style={styles.tipText}>
                        Did you enjoy your delivery experience?
                    </Text>
                    <Text style={styles.tipSubtext}>
                        Consider leaving a tip for your delivery partner!
                    </Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 24,
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 8,
    },
    celebrationContainer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 24,
    },
    celebrationImage: {
        width: 150,
        height: 150,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    summaryCard: {
        backgroundColor: '#F5F6F8',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    actions: {
        marginBottom: 24,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E23744',
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 8,
    },
    secondaryActions: {
        flexDirection: 'row',
        gap: 12,
    },
    secondaryButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E23744',
        paddingVertical: 14,
        borderRadius: 12,
    },
    secondaryButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#E23744',
        marginLeft: 6,
    },
    tipPrompt: {
        backgroundColor: '#FFF3E0',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    tipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F57C00',
        marginBottom: 4,
    },
    tipSubtext: {
        fontSize: 13,
        color: '#EF6C00',
    },
});

export default OrderCompletedModal;
