/**
 * Order History Types
 * Types for search, filtering and history management
 */

import { Order, OrderStatus } from './order.types';

export enum DateRangeFilter {
    ALL_TIME = 'All Time',
    LAST_30_DAYS = 'Last 30 Days',
    LAST_6_MONTHS = 'Last 6 Months',
    THIS_YEAR = 'This Year',
    LAST_YEAR = 'Last Year',
}

export interface OrderFilter {
    dateRange: DateRangeFilter;
    statuses: OrderStatus[];
    restaurantId?: string;
    searchQuery?: string;
}

export type OrderSortOption = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';

export interface HistoryPagination {
    page: number;
    limit: number;
    hasMore: boolean;
}

export interface OrderHistoryResponse {
    orders: Order[];
    pagination: HistoryPagination;
}
