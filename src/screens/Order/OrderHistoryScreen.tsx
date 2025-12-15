/**
 * Order History Screen
 * Displays list of past and active orders with filtering
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    ActivityIndicator,
    TextInput,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { Search, ShoppingBag } from 'lucide-react-native';

import { RootState, AppDispatch } from '../../store/store';
import { fetchHistory, fetchActiveOrders } from '../../store/slices/orderSlice';
import { Order, OrderStatus } from '../../types/order.types';
import { DateRangeFilter } from '../../types/history.types';
import { colors, spacing, typography, borderRadius } from '@zomato/design-tokens';
import { OrderStackParamList } from '../../types/order.types';

import { OrderHistoryCard, OrderFilters } from '../../components/Order';
import debounce from 'lodash.debounce';

type NavigationProp = StackNavigationProp<OrderStackParamList, 'OrderHistory'>;

const OrderHistoryScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const dispatch = useDispatch<AppDispatch>();

    // State
    const {
        orderHistory,
        activeOrder,
        isLoading,
        historyPagination
    } = useSelector((state: RootState) => state.order);

    const [activeTab, setActiveTab] = useState<'active' | 'history'>('history');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
    const [dateRange, setDateRange] = useState<DateRangeFilter>(DateRangeFilter.ALL_TIME);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Initial load
    useEffect(() => {
        loadData();
    }, []);

    // Active order check - if we have an active order, user might want to see that first
    useEffect(() => {
        if (activeOrder && activeTab === 'history') {
            // Optional: could enforce active tab, but let's stick to default history unless linked
        }
    }, [activeOrder]);

    const loadData = async () => {
        await Promise.all([
            dispatch(fetchActiveOrders()),
            dispatch(fetchHistory({
                page: 1,
                filters: {
                    dateRange,
                    statuses: statusFilter === 'all' ? [] : [statusFilter],
                    searchQuery
                }
            }))
        ]);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await loadData();
        setIsRefreshing(false);
    };

    const handleLoadMore = () => {
        if (!isLoading && historyPagination?.hasMore) {
            dispatch(fetchHistory({
                page: (historyPagination.page || 1) + 1,
                filters: {
                    dateRange,
                    statuses: statusFilter === 'all' ? [] : [statusFilter],
                    searchQuery
                }
            }));
        }
    };

    // Debounced search
    const debouncedSearch = useCallback(
        debounce((query: string) => {
            dispatch(fetchHistory({
                page: 1,
                filters: {
                    dateRange,
                    statuses: statusFilter === 'all' ? [] : [statusFilter],
                    searchQuery: query
                }
            }));
        }, 500),
        [dateRange, statusFilter]
    );

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        debouncedSearch(text);
    };

    const handleFilterChange = (status: OrderStatus | 'all') => {
        setStatusFilter(status);
        dispatch(fetchHistory({
            page: 1,
            filters: {
                dateRange,
                statuses: status === 'all' ? [] : [status],
                searchQuery
            }
        }));
    };

    const handleDateRangeChange = (range: DateRangeFilter) => {
        setDateRange(range);
        dispatch(fetchHistory({
            page: 1,
            filters: {
                dateRange: range,
                statuses: statusFilter === 'all' ? [] : [statusFilter],
                searchQuery
            }
        }));
    };

    const handleOrderPress = (orderId: string) => {
        navigation.navigate('OrderDetails', { orderId });
    };

    const handleReorder = (orderId: string) => {
        // Logic to add to cart
        // For now, simulate by navigating to cart with dummy data or just navigate
        // Ideally we check validity first
        navigation.navigate('ActiveOrder', { orderId }); // Demo: go to active tracking as "reordered" is generic
        // Or better:
        // navigation.navigate('Cart');
    };

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <ShoppingBag size={64} color={colors.secondary.gray_200} />
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptySubtitle}>
                Looks like you haven't placed any orders yet or check your filters.
            </Text>
        </View>
    );

    const renderHeader = () => (
        <View>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Search size={20} color={colors.secondary.gray_500} style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by restaurant or dish..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                    placeholderTextColor={colors.secondary.gray_400}
                />
            </View>

            {/* Filters */}
            <OrderFilters
                activeStatus={statusFilter}
                activeDateRange={dateRange}
                onStatusChange={handleFilterChange}
                onDateRangeChange={handleDateRangeChange}
            />

            {/* Active Orders Section (if any) */}
            {activeOrder && (
                <View style={styles.activeOrderSection}>
                    <Text style={styles.sectionTitle}>Active Order</Text>
                    <OrderHistoryCard
                        order={activeOrder}
                        onPress={() => navigation.navigate('ActiveOrder', { orderId: activeOrder.id })}
                        onReorder={() => { }} // No reorder for active
                    />
                </View>
            )}

            <Text style={styles.sectionTitle}>Past Orders</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Main Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Your Orders</Text>
            </View>

            <FlatList
                data={orderHistory}
                renderItem={({ item }) => (
                    <OrderHistoryCard
                        order={item}
                        onPress={() => handleOrderPress(item.id)}
                        onReorder={() => handleReorder(item.id)}
                    />
                )}
                keyExtractor={item => item.id}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={!isLoading ? renderEmptyState : null}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={['#E23744']} />
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={isLoading && orderHistory.length > 0 ? <ActivityIndicator color={colors.primary.zomato_red} style={{ padding: 10 }} /> : null}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.gray_50,
    },
    header: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        backgroundColor: colors.secondary.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.gray_100,
    },
    headerTitle: {
        ...typography.h4,
        color: colors.secondary.gray_900,
    },
    listContent: {
        paddingBottom: spacing.xl,
        flexGrow: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.secondary.white,
    },
    searchInput: {
        flex: 1,
        backgroundColor: colors.secondary.gray_100,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.sm,
        paddingHorizontal: 40,
        fontSize: 15, // keep custom if typopgraphy mismatch
        color: colors.secondary.gray_900,
        height: 40,
    },
    searchIcon: {
        position: 'absolute',
        left: 28, // adjust based on padding
        zIndex: 1,
    },
    sectionTitle: {
        ...typography.h5,
        color: colors.secondary.gray_900,
        marginHorizontal: spacing.lg,
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
    },
    activeOrderSection: {
        backgroundColor: '#FFF8F9', // Light red accent
        paddingBottom: 4,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyTitle: {
        ...typography.h4,
        color: colors.secondary.gray_900,
        marginTop: spacing.lg,
    },
    emptySubtitle: {
        ...typography.body_medium,
        color: colors.secondary.gray_600,
        textAlign: 'center',
        marginTop: spacing.sm,
        paddingHorizontal: 40,
    },
});

export default OrderHistoryScreen;
