/**
 * DeliveryPartnerCard Component
 * Shows delivery partner info with call/chat actions
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { Phone, MessageCircle, Star, Bike } from 'lucide-react-native';
import type { DeliveryPartner } from '../../services/api/api.types';

interface DeliveryPartnerCardProps {
    partner: DeliveryPartner;
    onChat?: () => void;
}

const DeliveryPartnerCard: React.FC<DeliveryPartnerCardProps> = ({ partner, onChat }) => {
    const handleCall = () => {
        Linking.openURL(`tel:${partner.phone}`);
    };

    const getVehicleIcon = () => {
        switch (partner.vehicleType) {
            case 'bike':
            case 'scooter':
            default:
                return <Bike size={14} color="#666" />;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: partner.photo }} style={styles.photo} />
                <View style={styles.info}>
                    <Text style={styles.name}>{partner.name}</Text>
                    <View style={styles.ratingRow}>
                        <Star size={14} color="#FFB800" fill="#FFB800" />
                        <Text style={styles.rating}>{partner.rating.toFixed(1)}</Text>
                        <View style={styles.vehicleBadge}>
                            {getVehicleIcon()}
                            <Text style={styles.vehicleNumber}>{partner.vehicleNumber}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
                    <Phone size={20} color="#E23744" />
                    <Text style={styles.actionText}>Call</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity style={styles.actionButton} onPress={onChat}>
                    <MessageCircle size={20} color="#E23744" />
                    <Text style={styles.actionText}>Chat</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    photo: {
        width: 54,
        height: 54,
        borderRadius: 27,
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontSize: 13,
        fontWeight: '500',
        color: '#333',
        marginLeft: 4,
        marginRight: 10,
    },
    vehicleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F6F8',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
    },
    vehicleNumber: {
        fontSize: 11,
        color: '#666',
        marginLeft: 4,
    },
    actions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingTop: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#E23744',
        marginLeft: 8,
    },
    divider: {
        width: 1,
        backgroundColor: '#F0F0F0',
    },
});

export default DeliveryPartnerCard;
