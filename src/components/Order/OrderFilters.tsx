/**
 * Order Filters Component
 * Horizontal scrolling list of filters (chips)
 */

import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { OrderStatus } from '../../types/order.types';
import { DateRangeFilter } from '../../types/history.types';
import { Filter, Calendar } from 'lucide-react-native';

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
                    <Filter size={16} color="#666" />
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
                    icon={<Calendar size={12} color={activeDateRange === DateRangeFilter.LAST_30_DAYS ? '#fff' : '#666'} />}
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
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    scrollContent: {
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 10,
        padding: 6,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginRight: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    activeChip: {
        backgroundColor: '#333',
        borderColor: '#333',
    },
    chipText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    activeChipText: {
        color: '#fff',
    },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 8,
    },
});

export default OrderFilters;
