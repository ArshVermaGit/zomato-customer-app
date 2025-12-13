import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Clock, MapPin, ChevronRight, Percent, CreditCard } from 'lucide-react-native';
import type { RootState } from '../../store/store';
import { setTip, clearCart } from '../../store/slices/cartSlice';
import CartItem from '../../components/Cart/CartItem';
import BillDetails from '../../components/Cart/BillDetails';
import TipSelector from '../../components/Cart/TipSelector';

const CartScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch();
    const { items, restaurant, bill } = useSelector((state: RootState) => state.cart);

    if (items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/11329/11329060.png' }}
                    style={styles.emptyImage}
                />
                <Text style={styles.emptyTitle}>Cart is empty</Text>
                <Text style={styles.emptySubtitle}>Good food is always cooking! Go ahead, order some yummy items from the menu.</Text>
                <TouchableOpacity style={styles.browseButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.browseButtonText}>Browse Restaurants</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const handleTipSelect = (amount: number) => {
        dispatch(setTip(amount));
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>{restaurant?.name}</Text>
                    <Text style={styles.headerSubtitle}>Delivery at Home</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Items List */}
                <View style={styles.section}>
                    {items.map((item) => (
                        <CartItem key={item.id} item={item} />
                    ))}
                    <TouchableOpacity style={styles.addMoreButton} onPress={() => navigation.goBack()}>
                        <PlusIcon />
                        <Text style={styles.addMoreText}>Add more items</Text>
                    </TouchableOpacity>
                </View>

                {/* Offers */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.offerRow}>
                        <View style={styles.offerLeft}>
                            <Percent size={20} color="#E23744" />
                            <Text style={styles.offerText}>Use coupons</Text>
                        </View>
                        <ChevronRight size={20} color="#ccc" />
                    </TouchableOpacity>
                </View>

                {/* Tip */}
                <TipSelector selectedTip={bill.tip} onSelectTip={handleTipSelect} />

                {/* Bill Details */}
                <BillDetails bill={bill} />

                {/* Delivery Instructions (Placeholder) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cancellation Policy</Text>
                    <Text style={styles.policyText}>
                        100% cancellation fee will be applicable if you decide to cancel the order anytime after order placement.
                    </Text>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.addressRow}>
                    <View style={styles.addressLeft}>
                        <MapPin size={16} color="#E23744" />
                        <Text style={styles.addressText}>Home • New Delhi</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Address')}>
                        <Text style={styles.changeText}>CHANGE</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.paymentRow}>
                    <View style={styles.paymentLeft}>
                        <View style={{ borderRightWidth: 1, borderRightColor: '#fff', paddingRight: 10, marginRight: 10 }}>
                            <Text style={styles.totalText}>₹{bill.grandTotal}</Text>
                            <Text style={styles.viewDetailedText}>TOTAL</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.placeOrderButton}
                        onPress={() => navigation.navigate('ActiveOrder', { orderId: 'order_2' })}
                    >
                        <Text style={styles.placeOrderText}>Place Order</Text>
                        <View style={styles.triangle} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

// Helper Icon
const PlusIcon = () => (
    <View style={{ width: 18, height: 18, borderRadius: 12, borderWidth: 1, borderColor: '#E23744', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
        <Text style={{ color: '#E23744', fontSize: 12, lineHeight: 14 }}>+</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6F8', // Light grey bg
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        elevation: 2,
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#666',
    },
    scrollContent: {
        padding: 15,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
    },
    addMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    addMoreText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#E23744',
    },
    offerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    offerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    offerText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    policyText: {
        fontSize: 12,
        color: '#666',
        lineHeight: 18,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        elevation: 10,
    },
    addressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    addressLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 5,
    },
    changeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#E23744',
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    paymentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    viewDetailedText: {
        fontSize: 10,
        color: '#E23744',
        fontWeight: 'bold',
        marginTop: 2,
    },
    placeOrderButton: {
        backgroundColor: '#E23744',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 8,
    },
    placeOrderText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    triangle: {
        // decorative triangle if needed
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 40,
    },
    emptyImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 20,
    },
    browseButton: {
        borderWidth: 1,
        borderColor: '#E23744',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    browseButtonText: {
        color: '#E23744',
        fontWeight: 'bold',
    }
});

export default CartScreen;
