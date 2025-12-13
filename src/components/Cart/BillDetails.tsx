import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
                    <Text style={[styles.label, { color: 'green' }]}>Item Discount</Text>
                    <Text style={[styles.value, { color: 'green' }]}>-₹{bill.discount}</Text>
                </View>
            )}

            <View style={styles.row}>
                <Text style={styles.topLabel}>Delivery Partner Fee</Text>
                <Text style={styles.value}>{bill.deliveryFee === 0 ? 'FREE' : `₹${bill.deliveryFee}`}</Text>
            </View>
            {bill.deliveryFee === 0 && <Text style={styles.subtext}>Free delivery for orders above ₹500</Text>}

            <View style={styles.row}>
                <Text style={styles.topLabel}>Platform Fee</Text>
                <Text style={styles.value}>₹{bill.platformFee}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.topLabel}>GST and Restaurant Charges</Text>
                <Text style={styles.value}>₹{bill.tax}</Text>
            </View>

            {bill.tip > 0 && (
                <View style={styles.row}>
                    <Text style={styles.label}>Delivery Tip</Text>
                    <Text style={styles.value}>₹{bill.tip}</Text>
                </View>
            )}

            <View style={styles.divider} />

            <View style={styles.row}>
                <Text style={styles.totalLabel}>To Pay</Text>
                <Text style={styles.totalValue}>₹{bill.grandTotal}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontSize: 14,
        color: '#666',
    },
    topLabel: {
        fontSize: 14,
        color: '#666',
        textDecorationLine: 'underline',
        textDecorationStyle: 'dotted',
    },
    value: {
        fontSize: 14,
        color: '#333',
    },
    subtext: {
        fontSize: 10,
        color: '#999',
        marginBottom: 10,
        marginTop: -5,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 10,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default BillDetails;
