/**
 * AddressLabelChip Component
 * Selectable chip component for address labels (Home, Work, Other)
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Home, Briefcase, MapPin } from 'lucide-react-native';
import { AddressLabel } from '../../types/address.types';

interface AddressLabelChipProps {
    selected: AddressLabel;
    onSelect: (label: AddressLabel) => void;
}

const labels: { value: AddressLabel; label: string; Icon: React.FC<{ size: number; color: string }> }[] = [
    { value: AddressLabel.HOME, label: 'Home', Icon: Home },
    { value: AddressLabel.WORK, label: 'Work', Icon: Briefcase },
    { value: AddressLabel.OTHER, label: 'Other', Icon: MapPin },
];

const AddressLabelChip: React.FC<AddressLabelChipProps> = ({ selected, onSelect }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Save as</Text>
            <View style={styles.chipsContainer}>
                {labels.map(({ value, label, Icon }) => {
                    const isSelected = selected === value;
                    return (
                        <TouchableOpacity
                            key={value}
                            style={[styles.chip, isSelected && styles.chipSelected]}
                            onPress={() => onSelect(value)}
                            activeOpacity={0.7}
                        >
                            <Icon size={16} color={isSelected ? '#fff' : '#666'} />
                            <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    chipsContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F5F6F8',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    chipSelected: {
        backgroundColor: '#E23744',
        borderColor: '#E23744',
    },
    chipText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
        marginLeft: 6,
    },
    chipTextSelected: {
        color: '#fff',
    },
});

export default AddressLabelChip;
