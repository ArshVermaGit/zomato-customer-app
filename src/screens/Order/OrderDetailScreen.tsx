/**
 * Order Detail Screen
 * Detailed view of a specific order including bill and timeline
 */

import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Share2, HelpCircle } from 'lucide-react-native';

import { Order, OrderStatus } from '../../types/order.types';
import { OrderHistoryService } from '../../services/orderHistory.service';
import {
    OrderStatusTimeline,
    InvoiceButton,
} from '../../components/Order';

const OrderDetailScreen = () => {
    const route = useRoute<any>(); // Bypass type check for demo
    const navigation = useNavigation<any>();
    const { orderId } = route.params;

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        setIsLoading(true);
        // We use the service directly here for simplicity, or could use Redux
        const data = await OrderHistoryService.getOrderDetails(orderId);
        setOrder(data);
        setIsLoading(false);
    };

    const handleShare = () => {
        Alert.alert('Share', `Sharing order ${order?.orderNumber}`);
    };

    const handleSupport = () => {
        Alert.alert('Support', 'Connecting to chat support...');
    };

    const handleRateOrder = () => {
        if (order) {
            navigation.navigate('RateOrder', { orderId: order.id });
        }
    };

    if (isLoading || !order) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text>Loading order details...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#333" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Order Summary</Text>
                    <Text style={styles.orderNumber}>{order.restaurant?.name || 'Restaurant'}</Text>
                </View>
                <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
                    <Share2 size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Status Banner */}
                <View style={styles.statusBanner}>
                    <Text style={styles.statusTitle}>
                        {order.status === OrderStatus.DELIVERED ? 'Order Delivered' : 'Order Cancelled'}
                    </Text>
                    <Text style={styles.statusTime}>
                        {order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : new Date(order.placedAt).toLocaleString()}
                    </Text>

                    {order.status === OrderStatus.DELIVERED && (
                        <TouchableOpacity style={styles.rateButton} onPress={handleRateOrder}>
                            <Text style={styles.rateButtonText}>Rate Order</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Items */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Items</Text>
                    {order.items.map((item, index) => (
                        <View key={item.id || index} style={styles.itemRow}>
                            <View style={styles.itemInfo}>
                                <Image
                                    source={item.isVeg
                                        ? require('../../assets/images/veg-icon.png')
                                        : require('../../assets/images/non-veg-icon.png')}
                                    style={styles.vegIcon}
                                />
                                <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                                <Text style={styles.itemName}>{item.name}</Text>
                            </View>
                            <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
                        </View>
                    ))}
                </View>

                {/* Bill Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Bill Details</Text>

                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Item Total</Text>
                        <Text style={styles.billValue}>₹{order.itemsTotal}</Text>
                    </View>
                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Delivery Fee</Text>
                        <Text style={styles.billValue}>₹{order.deliveryFee}</Text>
                    </View>
                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Taxes & Charges</Text>
                        <Text style={styles.billValue}>₹{order.taxes}</Text>
                    </View>
                    {order.discount > 0 && (
                        <View style={styles.billRow}>
                            <Text style={[styles.billLabel, styles.discountText]}>Discount</Text>
                            <Text style={[styles.billValue, styles.discountText]}>-₹{order.discount}</Text>
                        </View>
                    )}

                    <View style={styles.divider} />

                    <View style={styles.billRow}>
                        <Text style={styles.grandTotalLabel}>Grand Total</Text>
                        <Text style={styles.grandTotalValue}>₹{order.grandTotal}</Text>
                    </View>

                    <View style={styles.paymentInfo}>
                        <Text style={styles.paymentMethod}>Paid via UPI</Text>
                    </View>
                </View>

                {/* Tracking/Timeline (Static for history) */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Order Timeline</Text>
                    <OrderStatusTimeline timeline={order.timeline || []} />
                </View>

                {/* Order Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>Order Details</Text>
                    <Text style={styles.detailLabel}>Order ID</Text>
                    <Text style={styles.detailValue}>{order.orderNumber}</Text>

                    <Text style={styles.detailLabel}>Payment</Text>
                    <Text style={styles.detailValue}>Paid Online</Text>

                    <Text style={styles.detailLabel}>Deliver to</Text>
                    <Text style={styles.detailValue}>{order.customerAddress}</Text>
                </View>

                {/* Actions */}
                <View style={styles.actionsContainer}>
                    <InvoiceButton />

                    <TouchableOpacity style={styles.helpButton} onPress={handleSupport}>
                        <HelpCircle size={16} color="#333" />
                        <Text style={styles.helpText}>Get Help</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 40 }} />

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 4,
    },
    shareButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 12,
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    statusBanner: {
        backgroundColor: '#fff',
        padding: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        marginBottom: 12,
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },
    statusTime: {
        fontSize: 13,
        color: '#666',
    },
    rateButton: {
        marginTop: 16,
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E23744',
    },
    rateButtonText: {
        color: '#E23744',
        fontWeight: '600',
        fontSize: 14,
    },
    section: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#F0F0F0',
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    itemInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    vegIcon: {
        width: 14,
        height: 14,
        marginRight: 8,
    },
    itemQuantity: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
        marginRight: 8,
        width: 24,
    },
    itemName: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    itemPrice: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    billRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    billLabel: {
        fontSize: 14,
        color: '#666',
    },
    billValue: {
        fontSize: 14,
        color: '#333',
    },
    discountText: {
        color: '#2E7D32',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 12,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    grandTotalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    grandTotalValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    paymentInfo: {
        marginTop: 12,
        backgroundColor: '#F5F5F5',
        padding: 8,
        borderRadius: 4,
        alignItems: 'center',
    },
    paymentMethod: {
        fontSize: 12,
        color: '#666',
    },
    detailLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 14,
        color: '#333',
        marginBottom: 12,
    },
    actionsContainer: {
        backgroundColor: '#fff',
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    helpButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        padding: 10,
    },
    helpText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
});

export default OrderDetailScreen;
