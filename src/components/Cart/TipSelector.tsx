import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, borderRadius } from '@zomato/design-tokens';

interface TipSelectorProps {
    selectedTip: number;
    onSelectTip: (amount: number) => void;
}

const TIPS = [0, 20, 30, 50, 100];

const TipSelector = ({ selectedTip, onSelectTip }: TipSelectorProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>Tip your delivery partner</Text>
                    <Text style={styles.subtitle}>Thank your delivery partner for helping you stay safe indoors. Support them through these tough times.</Text>
                </View>
                {/* Optional Icon/Image here */}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {TIPS.map((amount) => {
                    const isSelected = selectedTip === amount;
                    return (
                        <TouchableOpacity
                            key={amount}
                            style={[
                                styles.chip,
                                isSelected && styles.selectedChip
                            ]}
                            onPress={() => onSelectTip(amount)}
                        >
                            <Text style={styles.emoji}>{getEmoji(amount)}</Text>
                            <Text style={[
                                styles.chipText,
                                isSelected && styles.selectedChipText
                            ]}>
                                {amount === 0 ? 'Not Now' : `₹${amount}`}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const getEmoji = (amount: number) => {
    if (amount === 0) return '🚫';
    if (amount <= 20) return '🙂';
    if (amount <= 50) return '😃';
    return '😍';
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.secondary.white,
        padding: spacing.md,
        borderRadius: borderRadius.xl,
        marginBottom: spacing.lg,
    },
    header: {
        flexDirection: 'row',
        marginBottom: spacing.md,
    },
    title: {
        ...typography.h4,
        color: colors.secondary.gray_900,
        marginBottom: 4,
    },
    subtitle: {
        ...typography.caption,
        color: colors.secondary.gray_500,
        lineHeight: 16,
    },
    scroll: {
        paddingVertical: 5,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.secondary.gray_200,
        borderRadius: borderRadius.lg, // Squarish rounded
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: spacing.sm,
        backgroundColor: colors.secondary.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 1,
        gap: 6,
    },
    selectedChip: {
        borderColor: colors.primary.zomato_red,
        backgroundColor: '#FFF5F6',
    },
    chipText: {
        ...typography.body_medium,
        fontWeight: '600',
        color: colors.secondary.gray_800,
    },
    selectedChipText: {
        color: colors.primary.zomato_red,
    },
    emoji: {
        fontSize: 14,
    }
});

export default TipSelector;
