/**
 * AddressCard Component
 * Displays a single address with edit, delete, and select actions
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Home, Briefcase, MapPin, Edit2, Trash2, Check } from 'lucide-react-native';
import type { Address, AddressLabel } from '../../types/address.types';
import { colors, spacing, typography, borderRadius, shadows } from '@zomato/design-tokens';

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
            return <Home size={20} color={colors.primary.zomato_red} />;
        case 'work':
            return <Briefcase size={20} color={colors.primary.zomato_red} />;
        default:
            return <MapPin size={20} color={colors.primary.zomato_red} />;
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
                    <View style={styles.iconCircle}>
                        {getLabelIcon(address.label)}
                    </View>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.labelText}>
                                {getLabelText(address.label, address.customLabel)}
                            </Text>
                            {address.isDefault && (
                                <View style={styles.defaultBadge}>
                                    <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                                </View>
                            )}
                        </View>
                        {/* Short Address Preview if needed in header, else just label */}
                    </View>
                </View>

                {/* Edit/Delete Actions */}
                <View style={styles.actions}>
                    {onEdit && (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => onEdit(address)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Text style={styles.editText}>EDIT</Text>
                        </TouchableOpacity>
                    )}
                    {onDelete && (
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => onDelete(address)}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Trash2 size={16} color={colors.secondary.gray_400} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.divider} />

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
                    activeOpacity={0.8}
                >
                    {isSelected && <Check size={16} color="#fff" style={styles.checkIcon} />}
                    <Text style={[styles.selectButtonText, isSelected && styles.selectedButtonText]}>
                        {isSelected ? 'Delivering Here' : 'Deliver Here'}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.secondary.white,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...shadows.sm,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedContainer: {
        borderColor: colors.primary.zomato_red,
        backgroundColor: '#FFF5F6',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFF5F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    labelText: {
        ...typography.h4,
        color: colors.secondary.gray_900,
        fontSize: 16,
    },
    defaultBadge: {
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginLeft: 8,
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
        padding: spacing.xs,
        marginLeft: spacing.sm,
    },
    editText: {
        ...typography.button_small,
        color: colors.primary.zomato_red,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: colors.secondary.gray_100,
        marginVertical: spacing.sm,
    },
    addressContent: {
        marginBottom: spacing.md,
    },
    houseNumber: {
        ...typography.body_medium,
        fontWeight: '600',
        color: colors.secondary.gray_900,
        marginBottom: 2,
    },
    fullAddress: {
        ...typography.body_small,
        color: colors.secondary.gray_600,
        lineHeight: 18,
    },
    landmark: {
        ...typography.caption,
        color: colors.secondary.gray_500,
        marginTop: 4,
        fontStyle: 'italic',
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.secondary.white,
        borderWidth: 1,
        borderColor: colors.primary.zomato_red,
        borderRadius: borderRadius.lg,
        paddingVertical: 12,
        marginTop: 4,
    },
    selectedButton: {
        backgroundColor: colors.primary.zomato_red,
    },
    selectButtonText: {
        ...typography.button_small,
        color: colors.primary.zomato_red,
    },
    selectedButtonText: {
        color: colors.secondary.white,
    },
    checkIcon: {
        marginRight: 6,
    },
});

export default AddressCard;
