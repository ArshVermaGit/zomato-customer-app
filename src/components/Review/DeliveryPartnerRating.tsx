/**
 * DeliveryPartnerRating Component
 * Separate rating section for delivery partner
 */

import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import StarRating from './StarRating';
import { DeliveryPartner } from '../../types/order.types';

interface DeliveryPartnerRatingProps {
    partner: DeliveryPartner;
    rating: number;
    onRatingChange: (rating: number) => void;
}

const DeliveryPartnerRating: React.FC<DeliveryPartnerRatingProps> = ({
    partner,
    rating,
    onRatingChange
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.divider} />

            <Text style={styles.title}>Rate Delivery Partner</Text>

            <View style={styles.partnerInfo}>
                <Image source={{ uri: partner.photo }} style={styles.photo} />
                <View>
                    <Text style={styles.name}>{partner.name}</Text>
                    <Text style={styles.vehicle}>{partner.vehicleType} • {partner.vehicleNumber}</Text>
                </View>
            </View>

            <StarRating
                rating={rating}
                onRatingChange={onRatingChange}
                size={32}
                showLabel={true}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
        width: '100%',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    partnerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    photo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    vehicle: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
        textTransform: 'capitalize',
    }
});

export default DeliveryPartnerRating;
