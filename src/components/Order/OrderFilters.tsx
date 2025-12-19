/**
 * Order Filters Component
 * Horizontal scrolling list of filters (chips)
 */

import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { OrderStatus } from '../../services/api/api.types';
import { DateRangeFilter } from '../../types/history.types';
import { Filter, Calendar } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '@zomato/design-tokens';

interface OrderFiltersProps {
    activeStatus: OrderStatus | 'all';
    activeDateRange: DateRangeFilter;
    onStatusChange: (status: OrderStatus | 'all') => void;
    onDateRangeChange: (range: DateRangeFilter) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
    activeStatus,
    activeDateRange,
    onStatusChange,
    onDateRangeChange,
}) => {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Filter Icon (Visual only) */}
                <View style={styles.iconContainer}>
                    <Filter size={16} color={colors.secondary.gray_600} />
                </View>

                {/* Status Filters */}
                <FilterChip
                    label="All Orders"
                    isActive={activeStatus === 'all'}
                    onPress={() => onStatusChange('all')}
                />
                <FilterChip
                    label="Delivered"
                    isActive={activeStatus === OrderStatus.DELIVERED}
                    onPress={() => onStatusChange(OrderStatus.DELIVERED)}
                />
                <FilterChip
                    label="Cancelled"
                    isActive={activeStatus === OrderStatus.CANCELLED}
                    onPress={() => onStatusChange(OrderStatus.CANCELLED)}
                />

                <View style={styles.divider} />

                {/* Date Filters */}
                <FilterChip
                    label="Last 30 Days"
                    isActive={activeDateRange === DateRangeFilter.LAST_30_DAYS}
                    onPress={() => onDateRangeChange(DateRangeFilter.LAST_30_DAYS)}
                    icon={<Calendar size={12} color={activeDateRange === DateRangeFilter.LAST_30_DAYS ? colors.secondary.white : colors.secondary.gray_600} />}
                />
                <FilterChip
                    label="All Time"
                    isActive={activeDateRange === DateRangeFilter.ALL_TIME}
                    onPress={() => onDateRangeChange(DateRangeFilter.ALL_TIME)}
                />
            </ScrollView>
        </View>
    );
};

const FilterChip = ({ label, isActive, onPress, icon }: { label: string; isActive: boolean; onPress: () => void; icon?: React.ReactNode }) => (
    <TouchableOpacity
        style={[styles.chip, isActive && styles.activeChip]}
        onPress={onPress}
        activeOpacity={0.7}
    >
        {icon && <View style={{ marginRight: 4 }}>{icon}</View>}
        <Text style={[styles.chipText, isActive && styles.activeChipText]}>
            {label}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        paddingVertical: spacing.md,
        backgroundColor: colors.secondary.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.gray_100,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: spacing.sm,
        padding: 6,
        backgroundColor: colors.secondary.gray_100,
        borderRadius: borderRadius.md,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: borderRadius.full,
        backgroundColor: colors.secondary.white,
        borderWidth: 1,
        borderColor: colors.secondary.gray_200,
        marginRight: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
    },
    activeChip: {
        backgroundColor: colors.secondary.gray_900,
        borderColor: colors.secondary.gray_900,
    },
    chipText: {
        ...typography.body_small,
        color: colors.secondary.gray_600,
        fontWeight: '500',
    },
    activeChipText: {
        color: colors.secondary.white,
    },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: colors.secondary.gray_200,
        marginHorizontal: spacing.sm,
    },
});

export default OrderFilters;
