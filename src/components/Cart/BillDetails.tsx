import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, borderRadius } from '@zomato/design-tokens';
import { Info } from 'lucide-react-native';

interface BillDetailsProps {
    bill: {
        itemTotal: number;
        deliveryFee: number;
        tax: number;
        platformFee: number;
        grandTotal: number;
        discount: number;
        tip: number;
    };
}

const BillDetails = ({ bill }: BillDetailsProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bill Details</Text>

            <View style={styles.row}>
                <Text style={styles.label}>Item Total</Text>
                <Text style={styles.value}>₹{bill.itemTotal}</Text>
            </View>

            {bill.discount > 0 && (
                <View style={styles.row}>
                    <Text style={[styles.label, { color: '#24963F' }]}>Item Discount</Text>
                    <Text style={[styles.value, { color: '#24963F' }]}>-₹{bill.discount}</Text>
                </View>
            )}

            <View style={styles.row}>
                <View style={styles.labelRow}>
                    <Text style={styles.dottedLabel}>Delivery Fee</Text>
                    <Text style={styles.distance}> | 2.5 kms</Text>
                </View>
                <View style={styles.valueRow}>
                    {bill.deliveryFee === 0 ? (
                        <Text style={[styles.value, { color: '#24963F' }]}>FREE</Text>
                    ) : (
                        <Text style={styles.value}>₹{bill.deliveryFee}</Text>
                    )}
                    {bill.deliveryFee > 0 && <Text style={styles.strikethrough}>₹40</Text>}
                </View>
            </View>

            {bill.deliveryFee === 0 && (
                <View style={styles.blueInfo}>
                    <Text style={styles.blueInfoText}>Free delivery on your order!</Text>
                </View>
            )}

            <View style={styles.row}>
                <View style={styles.labelRow}>
                    <Text style={styles.dottedLabel}>Platform Fee</Text>
                    <Info size={12} color={colors.secondary.gray_500} style={{ marginLeft: 4 }} />
                </View>
                <Text style={styles.value}>₹{bill.platformFee}</Text>
            </View>

            <View style={styles.row}>
                <View style={styles.labelRow}>
                    <Text style={styles.dottedLabel}>GST and Restaurant Charges</Text>
                    <Info size={12} color={colors.secondary.gray_500} style={{ marginLeft: 4 }} />
                </View>
                <Text style={styles.value}>₹{bill.tax}</Text>
            </View>

            {bill.tip > 0 && (
                <View style={styles.row}>
                    <Text style={styles.label}>Delivery Tip</Text>
                    <Text style={styles.value}>₹{bill.tip}</Text>
                </View>
            )}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>To Pay</Text>
                <Text style={styles.totalValue}>₹{bill.grandTotal}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.secondary.white,
        padding: spacing.md,
        borderRadius: borderRadius.xl,
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.h4,
        color: colors.secondary.gray_900,
        marginBottom: spacing.md,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
        alignItems: 'center',
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        ...typography.body_medium,
        color: colors.secondary.gray_600,
    },
    dottedLabel: {
        ...typography.body_medium,
        color: colors.secondary.gray_600,
        textDecorationLine: 'underline',
        textDecorationStyle: 'dotted',
    },
    distance: {
        ...typography.caption,
        color: colors.secondary.gray_500,
    },
    value: {
        ...typography.body_medium,
        color: colors.secondary.gray_900,
    },
    valueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    strikethrough: {
        ...typography.caption,
        color: colors.secondary.gray_400,
        textDecorationLine: 'line-through',
    },
    blueInfo: {
        backgroundColor: '#E8F3FF',
        padding: 6,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    blueInfoText: {
        ...typography.caption,
        color: '#256FEF',
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: colors.secondary.gray_200,
        marginVertical: spacing.md,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        ...typography.h3,
        color: colors.secondary.gray_900,
    },
    totalValue: {
        ...typography.h3,
        color: colors.secondary.gray_900,
    },
});

export default BillDetails;
