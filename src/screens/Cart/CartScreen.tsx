import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Percent, Home, ChevronRight } from 'lucide-react-native';
import type { RootState } from '../../store/store';
import { setTip, clearCart } from '../../store/slices/cartSlice';
import CartItem from '../../components/Cart/CartItem';
import BillDetails from '../../components/Cart/BillDetails';
import TipSelector from '../../components/Cart/TipSelector';
import { colors, spacing, typography, borderRadius, shadows } from '@zomato/design-tokens';
import { EmptyState } from '@zomato/ui';
import { useCreateOrderMutation } from '../../services/api/ordersApi';

const CartScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch();
    const { items, restaurant, bill, deliveryAddressId, paymentMethod } = useSelector((state: RootState) => state.cart);
    const [createOrder, { isLoading }] = useCreateOrderMutation();

    if (items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <EmptyState
                    variant="cart"
                    title="Your cart is empty"
                    description="Good food is always cooking! Go ahead, order some yummy items from the menu."
                    ctaText="Browse Restaurants"
                    onPressCta={() => navigation.goBack()}
                />
            </View>
        );
    }

    const handleTipSelect = (amount: number) => {
        dispatch(setTip(amount));
    };

    const handlePlaceOrder = async () => {
        // Validation (In real app, ensure address/payment is selected)
        // For MVP, we default or mock these if missing

        try {
            const orderPayload = {
                restaurantId: restaurant?.id,
                items: items.map(i => ({
                    menuItemId: i.dishId,
                    quantity: i.quantity,
                    price: i.finalPrice,
                    name: i.name // Helpful for backend if denormalized
                })),
                totalAmount: bill.grandTotal,
                addressId: deliveryAddressId || 'ADDR-DEFAULT', // TODO: Real address selection
                paymentMethod: paymentMethod || 'COD',
                instructions: '', // Todo: Add input for this
                // Tip, discount etc can be added to payload
            };

            const response = await createOrder(orderPayload).unwrap();

            // Success
            dispatch(clearCart());
            navigation.navigate('OrderSuccess', { orderId: response.id });
        } catch (error: any) {
            console.error('Order Placement Failed', error);
            Alert.alert('Order Failed', error.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.secondary.gray_900} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle} numberOfLines={1}>{restaurant?.name}</Text>
                    <Text style={styles.headerSubtitle}>Delivery at Home</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* 1. Items Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.sectionTitle}>Items Added</Text>
                        </View>
                    </View>
                    {items.map((item) => (
                        <CartItem key={item.id} item={item} />
                    ))}
                    <TouchableOpacity style={styles.addMoreButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.addMoreText}>+ Add more items</Text>
                    </TouchableOpacity>
                </View>

                {/* 2. Offers Card */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Offers & Benefits</Text>
                    <TouchableOpacity style={styles.offerRow}>
                        <View style={styles.offerLeft}>
                            <View style={styles.percentIcon}>
                                <Percent size={14} color={colors.primary.zomato_red} />
                            </View>
                            <View>
                                <Text style={styles.offerText}>Apply Coupon</Text>
                                <Text style={styles.offerSubtext}>Save more with coupons</Text>
                            </View>
                        </View>
                        <ChevronRight size={20} color={colors.secondary.gray_400} />
                    </TouchableOpacity>
                </View>

                {/* 3. Tip Selector */}
                <TipSelector selectedTip={bill.tip} onSelectTip={handleTipSelect} />

                {/* 5. Bill Details */}
                <BillDetails bill={bill} />

                {/* 6. Policy Text */}
                <View style={styles.policyContainer}>
                    <Text style={styles.policyTitle}>Cancellation Policy</Text>
                    <Text style={styles.policyText}>
                        100% cancellation fee will be applicable if you decide to cancel the order anytime after order placement.
                    </Text>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Footer with Address & Pay Button */}
            <View style={styles.footer}>
                {/* Address Strip */}
                <View style={styles.addressStrip}>
                    <View style={styles.addressLeft}>
                        <View style={styles.homeIcon}>
                            <Home size={14} color={colors.primary.zomato_red} fill={colors.primary.zomato_red} />
                        </View>
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={styles.addressTitle}>Home</Text>
                                <Text style={styles.addressSubtitle}> • Work</Text>
                            </View>
                            <Text style={styles.addressText} numberOfLines={1}>Sector 62, Noida, Uttar Pradesh...</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Address')}>
                        <Text style={styles.changeBtn}>CHANGE</Text>
                    </TouchableOpacity>
                </View>

                {/* Payment Section */}
                <View style={styles.paymentSection}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.totalText}>₹{bill.grandTotal}</Text>
                            <View style={styles.greenTag}><Text style={{ fontSize: 10, color: 'white', fontWeight: 'bold' }}>TOTAL</Text></View>
                        </View>
                        <TouchableOpacity><Text style={styles.viewDetailsLink}>View Detailed Bill</Text></TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.placeOrderButton, isLoading && { opacity: 0.7 }]}
                        onPress={handlePlaceOrder}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <View style={{ flex: 1, alignItems: 'center' }}>
                                    <Text style={styles.placeOrderText}>Place Order</Text>
                                </View>
                                <View style={styles.triangle} />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F5F7',
    },
    emptyContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingTop: 50,
        paddingBottom: spacing.sm,
        backgroundColor: colors.secondary.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.gray_100,
    },
    backButton: {
        marginRight: spacing.md,
        padding: 4,
    },
    headerTitle: {
        ...typography.h4,
        color: colors.secondary.gray_900,
    },
    headerSubtitle: {
        ...typography.caption,
        color: colors.secondary.gray_500,
    },
    scrollContent: {
        padding: spacing.md,
    },
    card: {
        backgroundColor: colors.secondary.white,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        marginBottom: spacing.lg,
        ...shadows.sm,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md
    },
    sectionTitle: {
        ...typography.h4,
        color: colors.secondary.gray_900,
        marginBottom: spacing.sm,
    },
    addMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.sm,
        paddingVertical: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.secondary.gray_100,
        borderStyle: 'dashed',
    },
    addMoreText: {
        ...typography.body_medium,
        color: colors.primary.zomato_red,
        fontWeight: '600',
    },
    offerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.sm,
    },
    offerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    percentIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FFF5F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    offerText: {
        ...typography.body_medium,
        fontWeight: '700',
        color: colors.secondary.gray_900,
    },
    offerSubtext: {
        ...typography.caption,
        color: colors.secondary.gray_500,
    },
    policyContainer: {
        padding: spacing.md,
        backgroundColor: colors.secondary.white,
        borderRadius: borderRadius.xl,
        marginBottom: spacing.lg,
    },
    policyTitle: {
        ...typography.caption,
        fontWeight: 'bold',
        color: colors.secondary.gray_700,
        marginBottom: 4,
    },
    policyText: {
        ...typography.caption,
        color: colors.secondary.gray_500,
        lineHeight: 16,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.secondary.white,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        ...shadows.xl,
    },
    addressStrip: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.gray_100,
    },
    addressLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    homeIcon: {
        marginRight: spacing.sm,
    },
    addressTitle: {
        ...typography.body_small,
        fontWeight: 'bold',
        color: colors.secondary.gray_900,
    },
    addressSubtitle: {
        ...typography.caption,
        color: colors.secondary.gray_500,
    },
    addressText: {
        ...typography.caption,
        color: colors.secondary.gray_600,
        marginTop: 2,
    },
    changeBtn: {
        ...typography.button_small,
        color: colors.primary.zomato_red,
    },
    paymentSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        paddingBottom: 30, // Bottom safe area
    },
    totalText: {
        ...typography.h3,
        color: colors.secondary.gray_900,
        marginRight: 6,
    },
    greenTag: {
        backgroundColor: '#24963F',
        paddingHorizontal: 4,
        borderRadius: 4,
    },
    viewDetailsLink: {
        ...typography.body_small,
        color: colors.primary.zomato_red,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    placeOrderButton: {
        backgroundColor: colors.primary.zomato_red,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: borderRadius.lg,
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
    },
    placeOrderText: {
        ...typography.h4,
        color: colors.secondary.white,
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderBottomWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'white',
        transform: [{ rotate: '90deg' }],
        position: 'absolute',
        right: 12,
    },
});

export default CartScreen;
