/**
 * AddressCard Component
 * Displays a single address with edit, delete, and select actions
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Home, Briefcase, MapPin, Edit2, Trash2, Check } from 'lucide-react-native';
import type { Address, AddressLabel } from '../../types/address.types';

interface AddressCardProps {
    address: Address;
    isSelected?: boolean;
    showSelectButton?: boolean;
    onSelect?: (address: Address) => void;
    onEdit?: (address: Address) => void;
    onDelete?: (address: Address) => void;
}

const getLabelIcon = (label: AddressLabel) => {
    switch (label) {
        case 'home':
            return <Home size={20} color="#E23744" />;
        case 'work':
            return <Briefcase size={20} color="#E23744" />;
        default:
            return <MapPin size={20} color="#E23744" />;
    }
};

const getLabelText = (label: AddressLabel, customLabel?: string) => {
    if (label === 'other' && customLabel) {
        return customLabel;
    }
    return label.charAt(0).toUpperCase() + label.slice(1);
};

const AddressCard: React.FC<AddressCardProps> = ({
    address,
    isSelected = false,
    showSelectButton = false,
    onSelect,
    onEdit,
    onDelete,
}) => {
    return (
        <View style={[styles.container, isSelected && styles.selectedContainer]}>
            <View style={styles.header}>
                <View style={styles.labelContainer}>
                    {getLabelIcon(address.label)}
                    <Text style={styles.labelText}>
                        {getLabelText(address.label, address.customLabel)}
                    </Text>
                    {address.isDefault && (
                        <View style={styles.defaultBadge}>
                            <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                        </View>
                    )}
                </View>
                <View style={styles.actions}>
                    {onEdit && (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => onEdit(address)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Edit2 size={18} color="#666" />
                        </TouchableOpacity>
                    )}
                    {onDelete && (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => onDelete(address)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Trash2 size={18} color="#E23744" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.addressContent}>
                <Text style={styles.houseNumber}>
                    {address.houseNumber}
                    {address.buildingName ? `, ${address.buildingName}` : ''}
                </Text>
                <Text style={styles.fullAddress} numberOfLines={2}>
                    {address.formattedAddress}
                </Text>
                {address.landmark && (
                    <Text style={styles.landmark}>
                        Landmark: {address.landmark}
                    </Text>
                )}
            </View>

            {showSelectButton && onSelect && (
                <TouchableOpacity
                    style={[
                        styles.selectButton,
                        isSelected && styles.selectedButton,
                    ]}
                    onPress={() => onSelect(address)}
                >
                    {isSelected && <Check size={16} color="#fff" style={styles.checkIcon} />}
                    <Text style={[styles.selectButtonText, isSelected && styles.selectedButtonText]}>
                        {isSelected ? 'Selected' : 'Deliver Here'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    selectedContainer: {
        borderWidth: 2,
        borderColor: '#E23744',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    labelText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 8,
    },
    defaultBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 10,
    },
    defaultBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#4CAF50',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        padding: 6,
        marginLeft: 8,
    },
    addressContent: {
        marginBottom: 12,
    },
    houseNumber: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    fullAddress: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    landmark: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
        fontStyle: 'italic',
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E23744',
        borderRadius: 8,
        paddingVertical: 10,
        marginTop: 4,
    },
    selectedButton: {
        backgroundColor: '#E23744',
    },
    selectButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#E23744',
    },
    selectedButtonText: {
        color: '#fff',
    },
    checkIcon: {
        marginRight: 6,
    },
});

export default AddressCard;
