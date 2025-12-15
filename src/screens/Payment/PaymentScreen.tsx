import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CreditCard, ChevronRight, ShieldCheck, Wallet } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, shadows } from '@zomato/design-tokens';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { createOrder } from '../../store/slices/orderSlice'; // Assumption: orderSlice exists or will be updated

const PAYMENT_METHODS = [
    {
        id: 'upi',
        title: 'UPI',
        subtitle: 'Google Pay, PhonePe, Paytm',
        icon: 'https://cdn-icons-png.flaticon.com/512/10109/10109840.png', // Placeholder
        type: 'upi'
    },
    {
        id: 'card',
        title: 'Credit / Debit Cards',
        subtitle: 'Visa, Mastercard, Rupay',
        icon: 'https://cdn-icons-png.flaticon.com/512/6963/6963703.png',
        type: 'card'
    },
    {
        id: 'wallet',
        title: 'Wallets',
        subtitle: 'Paytm, Amazon Pay, Mobikwik',
        icon: 'https://cdn-icons-png.flaticon.com/512/1077/1077892.png',
        type: 'wallet'
    },
    {
        id: 'cod',
        title: 'Cash on Delivery',
        subtitle: 'Pay cash to delivery partner',
        icon: 'https://cdn-icons-png.flaticon.com/512/2331/2331941.png',
        type: 'cod'
    }
];

const PaymentScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch<any>();
    const { bill } = useSelector((state: RootState) => state.cart);

    // In a real app, we might pass orderId or intent here
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

    const handlePayment = () => {
        if (!selectedMethod) return;

        // Simulate API call
        // In reality, this would trigger payment SDK or create order backend call
        navigation.replace('OrderSuccess');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ArrowLeft size={24} color={colors.secondary.gray_900} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Payment</Text>
                    <Text style={styles.headerSubtitle}>{bill?.grandTotal ? `To Pay: ₹${bill.grandTotal}` : ''}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Recommended */}
                <Text style={styles.sectionTitle}>Recommended</Text>
                {PAYMENT_METHODS.slice(0, 1).map((method) => (
                    <PaymentMethodItem
                        key={method.id}
                        item={method}
                        isSelected={selectedMethod === method.id}
                        onDefaultSelect={() => setSelectedMethod(method.id)} // Auto select logic if needed
                        onSelect={() => setSelectedMethod(method.id)}
                    />
                ))}

                {/* Other Options */}
                <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>Other Payment Methods</Text>
                {PAYMENT_METHODS.slice(1).map((method) => (
                    <PaymentMethodItem
                        key={method.id}
                        item={method}
                        isSelected={selectedMethod === method.id}
                        onSelect={() => setSelectedMethod(method.id)}
                    />
                ))}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.safetyBanner}>
                    <ShieldCheck size={14} color="#24963F" />
                    <Text style={styles.safetyText}>100% Safe & Secure Payments</Text>
                </View>

                <TouchableOpacity
                    style={[styles.payButton, !selectedMethod && styles.disabledButton]}
                    disabled={!selectedMethod}
                    onPress={handlePayment}
                >
                    <Text style={styles.payButtonText}>
                        {selectedMethod === 'cod' ? 'Place Order' : `Pay ₹${bill?.grandTotal || 0}`}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const PaymentMethodItem = ({ item, isSelected, onSelect }: any) => {
    return (
        <TouchableOpacity style={styles.methodCard} onPress={onSelect} activeOpacity={0.7}>
            <View style={styles.iconBox}>
                <Image source={{ uri: item.icon }} style={styles.icon} />
            </View>
            <View style={styles.methodInfo}>
                <Text style={styles.methodTitle}>{item.title}</Text>
                <Text style={styles.methodSubtitle}>{item.subtitle}</Text>
            </View>
            <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                {isSelected && <View style={styles.radioInner} />}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.gray_100,
    },
    backButton: {
        marginRight: spacing.md,
    },
    headerTitle: {
        ...typography.h4,
        color: colors.secondary.gray_900,
    },
    headerSubtitle: {
        ...typography.body_small,
        color: colors.secondary.gray_600,
    },
    content: {
        padding: spacing.md,
    },
    sectionTitle: {
        ...typography.h4,
        color: colors.secondary.gray_900,
        marginBottom: spacing.md,
    },
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.secondary.white,
        marginBottom: spacing.md,
        borderRadius: borderRadius.lg, // slightly simpler than Zomato usually but cleaner
        borderWidth: 1,
        borderColor: colors.secondary.gray_200,
        ...shadows.sm,
    },
    iconBox: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.secondary.gray_50,
        borderRadius: borderRadius.md,
        marginRight: spacing.md,
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    methodInfo: {
        flex: 1,
    },
    methodTitle: {
        ...typography.body_large,
        color: colors.secondary.gray_900,
        marginBottom: 2,
    },
    methodSubtitle: {
        ...typography.caption,
        color: colors.secondary.gray_500,
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.secondary.gray_400,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioOuterSelected: {
        borderColor: colors.primary.zomato_red,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary.zomato_red,
    },
    footer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.secondary.gray_100,
    },
    safetyBanner: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
        gap: 6,
    },
    safetyText: {
        ...typography.caption,
        color: '#24963F',
        fontWeight: '600',
    },
    payButton: {
        backgroundColor: colors.primary.zomato_red,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: colors.secondary.gray_400,
    },
    payButtonText: {
        ...typography.h4,
        color: colors.secondary.white,
    },
});

export default PaymentScreen;
