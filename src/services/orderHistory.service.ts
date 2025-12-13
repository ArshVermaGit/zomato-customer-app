/**
 * Order History Service
 * Mock service for fetching past orders with filtering and search
 */

import { Order, OrderStatus } from '../types/order.types';
import { OrderFilter, DateRangeFilter, OrderHistoryResponse } from '../types/history.types';
import { OrderTrackingService } from './orderTracking.service'; // Reuse mock data generation if possible or duplicate
// We'll create fresh mock data for history to have more variety

const mockDelay = (ms: number = 800) => new Promise(resolve => setTimeout(() => resolve(true), ms));

// Helper to generate random past date
const getRandomDate = (daysBack: number) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
    return date.toISOString();
};

// Generate some mock past orders
const generateMockHistory = (): Order[] => {
    const orders: Order[] = [];
    const restaurants = [
        { id: 'r1', name: 'Burger King', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', address: 'Connaught Place' },
        { id: 'r2', name: 'Domino\'s Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', address: 'Sector 18' },
        { id: 'r3', name: 'Haldiram\'s', image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', address: 'Chandni Chowk' },
        { id: 'r4', name: 'Starbucks', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400', address: 'Cyber Hub' },
    ];

    for (let i = 1; i <= 20; i++) {
        const rest = restaurants[Math.floor(Math.random() * restaurants.length)];
        const isDelivered = Math.random() > 0.1; // 90% delivered, 10% cancelled

        orders.push({
            id: `hist_${i}`,
            orderNumber: `ZMT${200000 + i}`,
            status: isDelivered ? OrderStatus.DELIVERED : OrderStatus.CANCELLED,
            items: [
                { id: `i_${i}_1`, name: 'Delicious Item ' + i, quantity: 1, price: 150 + i * 10, isVeg: Math.random() > 0.5 },
                { id: `i_${i}_2`, name: 'Extra Side ' + i, quantity: 2, price: 50, isVeg: true },
            ],
            restaurant: {
                ...rest,
                latitude: 28.5 + Math.random() * 0.1,
                longitude: 77.2 + Math.random() * 0.1,
            },
            customerAddress: 'Home',
            customerLatitude: 28.55,
            customerLongitude: 77.25,
            timeline: [], // Populated on detail view usually
            placedAt: getRandomDate(60), // Past 60 days
            itemsTotal: 250 + i * 10,
            deliveryFee: 30,
            taxes: 15,
            discount: 0,
            grandTotal: 295 + i * 10,
            estimatedDeliveryTime: '', // Not relevant for history
            isCancellable: false,
            canReorder: true,
        });
    }

    // Sort by date desc
    return orders.sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime());
};

const PAST_ORDERS = generateMockHistory();

export const OrderHistoryService = {
    /**
     * Get order history with pagination and filters
     */
    getHistory: async (
        page: number = 1,
        limit: number = 10,
        filters: OrderFilter
    ): Promise<OrderHistoryResponse> => {
        await mockDelay();

        let filtered = [...PAST_ORDERS];

        // 1. Filter by Status
        if (filters.statuses && filters.statuses.length > 0) {
            filtered = filtered.filter(o => filters.statuses.includes(o.status));
        }

        // 2. Filter by Date Range (Mock logic)
        const now = new Date();
        if (filters.dateRange === DateRangeFilter.LAST_30_DAYS) {
            const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
            filtered = filtered.filter(o => new Date(o.placedAt) >= thirtyDaysAgo);
        }
        // ... add other date logic as needed

        // 3. Search Query
        if (filters.searchQuery) {
            const q = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(o =>
                o.restaurant.name.toLowerCase().includes(q) ||
                o.items.some(i => i.name.toLowerCase().includes(q)) ||
                o.orderNumber.toLowerCase().includes(q)
            );
        }

        // Pagination
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedOrders = filtered.slice(start, end);

        return {
            orders: paginatedOrders,
            pagination: {
                page,
                limit,
                hasMore: end < filtered.length,
            }
        };
    },

    /**
     * Get order details by ID
     */
    getOrderDetails: async (orderId: string): Promise<Order | null> => {
        await mockDelay();
        const order = PAST_ORDERS.find(o => o.id === orderId);
        if (!order) return null;

        // Generate timeline on the fly
        const statusOrder = [
            OrderStatus.PLACED,
            OrderStatus.ACCEPTED,
            OrderStatus.PREPARING,
            OrderStatus.READY,
            OrderStatus.OUT_FOR_DELIVERY,
            OrderStatus.DELIVERED,
        ];

        const currentIndex = statusOrder.indexOf(order.status);

        const timeline = statusOrder.map((status, index) => ({
            status,
            timestamp: index <= currentIndex ? (index === currentIndex ? (order.deliveredAt || order.placedAt) : order.placedAt) : '',
            isCompleted: index < currentIndex,
            isCurrent: index === currentIndex,
        }));

        return { ...order, timeline };
    },

    /**
     * Reorder valid check
     */
    canReorder: async (orderId: string): Promise<boolean> => {
        await mockDelay(500);
        return true; // Always allow for demo
    }
};
