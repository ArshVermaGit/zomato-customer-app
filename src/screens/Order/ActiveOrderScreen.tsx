/**
 * ActiveOrderScreen
 * Main order tracking screen with collapsed and expanded states
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Linking,
    Image,
    ActivityIndicator,
    Dimensions,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import {
    ArrowLeft,
    Phone,
    HelpCircle,
    X,
    ChevronDown,
} from 'lucide-react-native';
import type { RootState, AppDispatch } from '../../store/store';
import type { OrderStackParamList, WSMessage, OrderStatus } from '../../types/order.types';
import { OrderStatus as OrderStatusEnum } from '../../types/order.types';
import {
    fetchOrder,
    updateOrderStatus,
    updateDeliveryLocation,
    updateETA,
    assignDeliveryPartner,
    setOrderCompleted,
    setTrackingConnected,
    cancelOrder,
} from '../../store/slices/orderSlice';
import { WebSocketService } from '../../services/websocket.service';
import { OrderTrackingService } from '../../services/orderTracking.service';
import {
    OrderStatusTimeline,
    LiveDeliveryMap,
    DeliveryPartnerCard,
    OrderItemsSummary,
    OrderCompletedModal,
} from '../../components/Order';

type NavigationProp = StackNavigationProp<OrderStackParamList, 'ActiveOrder'>;
type RouteProps = RouteProp<OrderStackParamList, 'ActiveOrder'>;

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ActiveOrderScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const dispatch = useDispatch<AppDispatch>();

    const { orderId } = route.params;
    const {
        activeOrder,
        isLoading,
        error,
        deliveryPartnerLocation,
    } = useSelector((state: RootState) => state.order);

    const [showCompletedModal, setShowCompletedModal] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    // Fetch order on mount
    useFocusEffect(
        useCallback(() => {
            dispatch(fetchOrder(orderId));
        }, [dispatch, orderId])
    );

    // Connect to WebSocket for real-time updates
    useEffect(() => {
        if (!activeOrder) return;

        const handleMessage = (message: WSMessage) => {
            switch (message.type) {
                case 'status_update':
                    dispatch(updateOrderStatus({
                        status: message.payload.status,
                        timestamp: message.payload.timestamp,
                    }));
                    break;
                case 'location_update':
                    dispatch(updateDeliveryLocation(message.payload));
                    break;
                case 'eta_update':
                    dispatch(updateETA(message.payload));
                    break;
                case 'partner_assigned':
                    dispatch(assignDeliveryPartner(message.payload));
                    break;
                case 'order_completed':
                    dispatch(setOrderCompleted({
                        deliveredAt: message.payload.deliveredAt,
                    }));
                    setShowCompletedModal(true);
                    break;
            }
        };

        WebSocketService.connect(orderId, handleMessage);
        dispatch(setTrackingConnected(true));

        return () => {
            WebSocketService.disconnect(orderId, handleMessage);
            dispatch(setTrackingConnected(false));
        };
    }, [activeOrder?.id, orderId, dispatch]);

    const handleCallRestaurant = () => {
        if (activeOrder?.restaurant.phone) {
            Linking.openURL(`tel:${activeOrder.restaurant.phone}`);
        }
    };

    const handleCallPartner = () => {
        if (activeOrder?.deliveryPartner?.phone) {
            Linking.openURL(`tel:${activeOrder.deliveryPartner.phone}`);
        }
    };

    const handleHelp = () => {
        // Navigate to help screen
        console.log('Navigate to help');
    };

    const handleCancelOrder = async () => {
        if (!activeOrder?.isCancellable) return;

        setIsCancelling(true);
        try {
            await dispatch(cancelOrder(orderId)).unwrap();
            navigation.goBack();
        } catch (err) {
            console.error('Cancel failed:', err);
        } finally {
            setIsCancelling(false);
        }
    };

    const handleRateOrder = () => {
        setShowCompletedModal(false);
        // Navigation is handled inside the modal now or we can do it here if we pass navigation
        // But since we updated the modal to handle it, we might not need this handler prop anymore
        // However, for backward compatibility or if avoiding navigation in modal:
        navigation.navigate('RateOrder', { orderId });
    };

    const handleViewReceipt = () => {
        setShowCompletedModal(false);
        // Navigate to receipt screen
        console.log('Navigate to receipt');
    };

    const handleReorder = () => {
        setShowCompletedModal(false);
        // Navigate to restaurant and add items to cart
        console.log('Reorder');
    };

    if (isLoading && !activeOrder) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#E23744" />
                <Text style={styles.loadingText}>Loading order...</Text>
            </SafeAreaView>
        );
    }

    if (error || !activeOrder) {
        return (
            <SafeAreaView style={styles.errorContainer}>
                <Text style={styles.errorText}>
                    {error || 'Order not found'}
                </Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => dispatch(fetchOrder(orderId))}
                >
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const isOutForDelivery = activeOrder.status === OrderStatusEnum.OUT_FOR_DELIVERY;
    const etaText = OrderTrackingService.getEstimatedTimeRemaining(activeOrder);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Track Order</Text>
                    <Text style={styles.orderNumber}>#{activeOrder.orderNumber}</Text>
                </View>
                <TouchableOpacity onPress={handleHelp} style={styles.helpButton}>
                    <HelpCircle size={24} color="#666" />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Restaurant Info */}
                <View style={styles.restaurantCard}>
                    <Image
                        source={{ uri: activeOrder.restaurant.image }}
                        style={styles.restaurantImage}
                    />
                    <View style={styles.restaurantInfo}>
                        <Text style={styles.restaurantName}>
                            {activeOrder.restaurant.name}
                        </Text>
                        <Text style={styles.restaurantAddress}>
                            {activeOrder.restaurant.address}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.callRestaurantButton}
                        onPress={handleCallRestaurant}
                    >
                        <Phone size={18} color="#E23744" />
                    </TouchableOpacity>
                </View>

                {/* ETA Banner */}
                <View style={styles.etaBanner}>
                    <View style={styles.etaLeft}>
                        <Text style={styles.etaLabel}>Estimated Delivery</Text>
                        <Text style={styles.etaTime}>{etaText}</Text>
                    </View>
                    <View style={styles.etaRight}>
                        <View style={styles.pulseDot} />
                    </View>
                </View>

                {/* Live Map (when out for delivery) */}
                {isOutForDelivery && activeOrder.deliveryPartner && (
                    <LiveDeliveryMap
                        order={activeOrder}
                        deliveryLocation={deliveryPartnerLocation}
                    />
                )}

                {/* Delivery Partner Card */}
                {activeOrder.deliveryPartner && (
                    <DeliveryPartnerCard
                        partner={activeOrder.deliveryPartner}
                        onChat={() => console.log('Chat')}
                    />
                )}

                {/* Order Status Timeline */}
                <OrderStatusTimeline timeline={activeOrder.timeline} />

                {/* Order Items */}
                <OrderItemsSummary items={activeOrder.items} />

                {/* Actions */}
                <View style={styles.actionsContainer}>
                    {activeOrder.isCancellable && (
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleCancelOrder}
                            disabled={isCancelling}
                        >
                            <X size={18} color="#E23744" />
                            <Text style={styles.cancelButtonText}>
                                {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Bill Summary */}
                <View style={styles.billCard}>
                    <Text style={styles.billTitle}>Bill Summary</Text>
                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Item Total</Text>
                        <Text style={styles.billValue}>₹{activeOrder.itemsTotal}</Text>
                    </View>
                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Delivery Fee</Text>
                        <Text style={styles.billValue}>₹{activeOrder.deliveryFee}</Text>
                    </View>
                    <View style={styles.billRow}>
                        <Text style={styles.billLabel}>Taxes</Text>
                        <Text style={styles.billValue}>₹{activeOrder.taxes}</Text>
                    </View>
                    {activeOrder.discount > 0 && (
                        <View style={styles.billRow}>
                            <Text style={styles.billLabel}>Discount</Text>
                            <Text style={[styles.billValue, styles.discountValue]}>
                                -₹{activeOrder.discount}
                            </Text>
                        </View>
                    )}
                    <View style={styles.billDivider} />
                    <View style={styles.billRow}>
                        <Text style={styles.grandTotalLabel}>Grand Total</Text>
                        <Text style={styles.grandTotalValue}>₹{activeOrder.grandTotal}</Text>
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* Order Completed Modal */}
            <OrderCompletedModal
                visible={showCompletedModal}
                order={activeOrder}
                onClose={() => setShowCompletedModal(false)}
                onViewReceipt={handleViewReceipt}
                onReorder={handleReorder}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6F8',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#E23744',
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#E23744',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    backButton: {
        padding: 4,
    },
    headerCenter: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    orderNumber: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    helpButton: {
        padding: 4,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    restaurantCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
    },
    restaurantImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 12,
    },
    restaurantInfo: {
        flex: 1,
    },
    restaurantName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    restaurantAddress: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    callRestaurantButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFEBEE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    etaBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#E23744',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    etaLeft: {},
    etaLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    etaTime: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        marginTop: 2,
    },
    etaRight: {},
    pulseDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4CAF50',
    },
    actionsContainer: {
        marginBottom: 16,
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E23744',
        borderRadius: 10,
        paddingVertical: 14,
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#E23744',
        marginLeft: 8,
    },
    billCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },
    billTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
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
    discountValue: {
        color: '#4CAF50',
    },
    billDivider: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 8,
    },
    grandTotalLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    grandTotalValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
});

export default ActiveOrderScreen;
