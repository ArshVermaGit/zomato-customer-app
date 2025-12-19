/**
 * ActiveOrderScreen
 * Main order tracking screen with Live Map background and Bottom Sheet details
 */

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
    ActivityIndicator,
    Dimensions,
    Platform,
    StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { ArrowLeft, HelpCircle, Phone } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, shadows } from '@zomato/design-tokens';
import type { OrderStackParamList } from '../../types/order.types';
import { useGetOrderByIdQuery } from '../../services/api/ordersApi';
import { WebSocketService } from '../../services/websocket.service';
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
const MAP_HEIGHT = SCREEN_HEIGHT * 0.55;
const SHEET_MIN_HEIGHT = SCREEN_HEIGHT * 0.45;

const ActiveOrderScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const { orderId } = route.params;

    // Use RTK Query Hook with Polling (fallback if WS not perfect yet)
    const { data: orderResponse, isLoading, error, refetch } = useGetOrderByIdQuery(orderId, {
        pollingInterval: 5000,
    });
    const activeOrder = orderResponse?.data;

    const [showCompletedModal, setShowCompletedModal] = useState(false);


    // WebSocket Connection for instant updates (Optional optimization)
    useEffect(() => {
        if (!activeOrder) return;
        const handleMessage = () => {
            // For now, simpler to just refetch on any relevant event
            refetch();
        };
        WebSocketService.connect(orderId, handleMessage);
        return () => {
            WebSocketService.disconnect(orderId, handleMessage);
        };
    }, [activeOrder?.id, orderId, refetch]);

    const handleCallRestaurant = () => {
        if (activeOrder?.restaurant?.phone) Linking.openURL(`tel:${activeOrder.restaurant.phone}`);
    };



    const handleHelp = () => {
        // Navigate to help
    };

    if (isLoading && !activeOrder) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary.zomato_red} />
                <Text style={styles.loadingText}>Fetching your order...</Text>
            </View>
        );
    }

    if (error || !activeOrder) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Unable to load order</Text>
                <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            {/* 1. Full Screen Map (Background) */}
            <View style={styles.mapContainer}>
                <LiveDeliveryMap
                    order={activeOrder}
                    deliveryLocation={activeOrder.driverLocation || null} // Assuming backend sends this
                    style={styles.map}
                />
            </View>

            {/* 2. Floating Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <ArrowLeft size={24} color={colors.secondary.gray_900} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Order #{activeOrder.id?.slice(-6) || '...'}</Text>
                </View>
                <TouchableOpacity onPress={handleHelp} style={styles.iconButton}>
                    <HelpCircle size={24} color={colors.secondary.gray_900} />
                </TouchableOpacity>
            </View>

            {/* 3. Bottom Sheet Content */}
            <View style={styles.bottomSheet}>
                <View style={styles.handleBar} />

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.bottomSheetContent}
                >
                    {/* Status Header */}
                    <Text style={styles.statusTitle}>
                        {activeOrder.status?.replace(/_/g, ' ')}
                    </Text>
                    <Text style={styles.subStatus}>
                        {activeOrder.deliveryPartner ? `${activeOrder.deliveryPartner.name} is on the way` : 'Preparing your food'}
                    </Text>

                    {/* Delivery Partner Card */}
                    {activeOrder.deliveryPartner && (
                        <View style={styles.section}>
                            <DeliveryPartnerCard
                                partner={activeOrder.deliveryPartner}
                                onChat={() => { }}
                            />
                        </View>
                    )}

                    {/* Timeline */}
                    <View style={styles.section}>
                        <OrderStatusTimeline timeline={activeOrder.timeline || []} />
                    </View>

                    {/* Order Items */}
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>Order Details</Text>
                        <OrderItemsSummary items={activeOrder.items} />
                    </View>

                    {/* Restaurant Info */}
                    <View style={styles.restaurantRow}>
                        <Text style={styles.restaurantName}>From {activeOrder.restaurant?.name}</Text>
                        <TouchableOpacity onPress={handleCallRestaurant} style={styles.callRestButton}>
                            <Phone size={16} color={colors.primary.zomato_red} />
                            <Text style={styles.callRestText}>Call</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>
            </View>

            {/* Order Completed Modal */}
            <OrderCompletedModal
                visible={showCompletedModal}
                order={activeOrder}
                onClose={() => setShowCompletedModal(false)}
                onViewReceipt={() => { }}
                onReorder={() => { }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.white,
    },
    mapContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: MAP_HEIGHT + 30, // Slight overlap
    },
    map: {
        flex: 1,
        height: '100%',
        marginBottom: 0, // Override default margin
        borderRadius: 0,
    },
    header: {
        position: 'absolute',
        top: 0, // StatusBar handled by translucent
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight! + 10 : 50,
        zIndex: 10,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.secondary.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.sm,
    },
    headerTitleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        ...typography.body_large,
        fontWeight: 'bold',
        backgroundColor: colors.secondary.white,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
        ...shadows.sm,
    },
    bottomSheet: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: SHEET_MIN_HEIGHT,
        backgroundColor: colors.secondary.white,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        ...shadows.lg,
        elevation: 20,
    },
    handleBar: {
        width: 40,
        height: 5,
        backgroundColor: colors.secondary.gray_300,
        borderRadius: 2.5,
        alignSelf: 'center',
        marginTop: spacing.sm,
        marginBottom: spacing.xs,
    },
    bottomSheetContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.sm,
    },
    statusTitle: {
        ...typography.h3,
        color: colors.secondary.gray_900,
        marginTop: spacing.sm,
        textTransform: 'capitalize',
    },
    subStatus: {
        ...typography.body_medium,
        color: colors.secondary.gray_500,
        marginBottom: spacing.lg,
    },
    section: {
        marginBottom: spacing.lg,
    },
    sectionHeader: {
        ...typography.h4,
        marginBottom: spacing.md,
    },
    restaurantRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.secondary.gray_100,
        marginBottom: spacing.md,
    },
    restaurantName: {
        ...typography.body_large,
        fontWeight: '600',
    },
    callRestButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        padding: spacing.sm,
        backgroundColor: colors.secondary.gray_100,
        borderRadius: borderRadius.full,
    },
    callRestText: {
        ...typography.button_small,
        color: colors.primary.zomato_red,
    },
    cancelButton: {
        alignItems: 'center',
        paddingVertical: spacing.md,
    },
    cancelButtonText: {
        ...typography.body_medium,
        color: colors.primary.zomato_red,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        ...typography.body_medium,
        marginTop: spacing.md,
        color: colors.secondary.gray_500,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    errorText: {
        ...typography.body_large,
        color: colors.primary.zomato_red,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    retryButton: {
        backgroundColor: colors.primary.zomato_red,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
    },
    retryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
        lineHeight: 24,
        color: colors.secondary.white,
    },
});

export default ActiveOrderScreen;
