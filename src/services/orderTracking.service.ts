/**
 * Order Tracking Service
 * Mock API service for order tracking and management
 */

import {
    Order,
    OrderStatus,
    OrderTimelineEvent,
} from '../types/order.types';
import type {
    OrderItem,
    OrderRestaurant,
    DeliveryPartner,
} from '../types/order.types';

// Mock delay
const mockDelay = (ms: number = 500) => new Promise<void>(resolve => setTimeout(resolve, ms));

// Generate timeline from status
const generateTimeline = (currentStatus: OrderStatus, timestamps: Partial<Record<OrderStatus, string>>): OrderTimelineEvent[] => {
    const statusOrder: OrderStatus[] = [
        OrderStatus.PLACED,
        OrderStatus.ACCEPTED,
        OrderStatus.PREPARING,
        OrderStatus.READY,
        OrderStatus.OUT_FOR_DELIVERY,
        OrderStatus.DELIVERED,
    ];

    const currentIndex = statusOrder.indexOf(currentStatus);

    return statusOrder.map((status, index) => ({
        status,
        timestamp: timestamps[status] || '',
        isCompleted: index < currentIndex,
        isCurrent: index === currentIndex,
    }));
};

// Mock order data
const mockOrders: Record<string, Order> = {
    'order_1': {
        id: 'order_1',
        orderNumber: 'ZMT123456',
        status: OrderStatus.PREPARING,
        items: [
            { id: '1', name: 'Butter Chicken', quantity: 1, price: 350, isVeg: false },
            { id: '2', name: 'Garlic Naan', quantity: 2, price: 60, isVeg: true },
            { id: '3', name: 'Dal Makhani', quantity: 1, price: 220, isVeg: true },
        ],
        restaurant: {
            id: 'rest_1',
            name: 'Punjab Grill',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
            address: 'Connaught Place, New Delhi',
            phone: '+91 98765 43210',
            latitude: 28.6315,
            longitude: 77.2167,
        },
        customerAddress: '42, Sunrise Apartments, New Delhi',
        customerLatitude: 28.6139,
        customerLongitude: 77.2090,
        timeline: [],
        placedAt: new Date(Date.now() - 15 * 60000).toISOString(),
        acceptedAt: new Date(Date.now() - 12 * 60000).toISOString(),
        preparingAt: new Date(Date.now() - 10 * 60000).toISOString(),
        itemsTotal: 690,
        deliveryFee: 30,
        taxes: 52,
        discount: 0,
        grandTotal: 772,
        estimatedDeliveryTime: new Date(Date.now() + 20 * 60000).toISOString(),
        isCancellable: true,
        canReorder: true,
    },
    'order_2': {
        id: 'order_2',
        orderNumber: 'ZMT789012',
        status: OrderStatus.OUT_FOR_DELIVERY,
        items: [
            { id: '1', name: 'Margherita Pizza', quantity: 1, price: 299, isVeg: true },
            { id: '2', name: 'Pepperoni Pizza', quantity: 1, price: 399, isVeg: false },
        ],
        restaurant: {
            id: 'rest_2',
            name: 'Pizza Express',
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
            address: 'Sector 18, Noida',
            phone: '+91 98765 43211',
            latitude: 28.5707,
            longitude: 77.3219,
        },
        deliveryPartner: {
            id: 'dp_1',
            name: 'Rahul Kumar',
            photo: 'https://randomuser.me/api/portraits/men/32.jpg',
            phone: '+91 98765 12345',
            rating: 4.8,
            vehicleType: 'bike',
            vehicleNumber: 'DL 10 AB 1234',
            latitude: 28.5900,
            longitude: 77.3100,
        },
        customerAddress: '42, Sunrise Apartments, New Delhi',
        customerLatitude: 28.6139,
        customerLongitude: 77.2090,
        timeline: [],
        placedAt: new Date(Date.now() - 45 * 60000).toISOString(),
        acceptedAt: new Date(Date.now() - 42 * 60000).toISOString(),
        preparingAt: new Date(Date.now() - 40 * 60000).toISOString(),
        readyAt: new Date(Date.now() - 15 * 60000).toISOString(),
        outForDeliveryAt: new Date(Date.now() - 10 * 60000).toISOString(),
        itemsTotal: 698,
        deliveryFee: 40,
        taxes: 56,
        discount: 50,
        grandTotal: 744,
        estimatedDeliveryTime: new Date(Date.now() + 10 * 60000).toISOString(),
        isCancellable: false,
        canReorder: true,
    },
};

export const OrderTrackingService = {
    /**
     * Get order details
     * GET /orders/:id
     */
    getOrder: async (orderId: string): Promise<Order | null> => {
        await mockDelay();

        const order = mockOrders[orderId];
        if (!order) return null;

        // Generate timeline
        const timestamps: Partial<Record<OrderStatus, string>> = {
            [OrderStatus.PLACED]: order.placedAt,
            [OrderStatus.ACCEPTED]: order.acceptedAt,
            [OrderStatus.PREPARING]: order.preparingAt,
            [OrderStatus.READY]: order.readyAt,
            [OrderStatus.OUT_FOR_DELIVERY]: order.outForDeliveryAt,
            [OrderStatus.DELIVERED]: order.deliveredAt,
        };

        return {
            ...order,
            timeline: generateTimeline(order.status, timestamps),
        };
    },

    /**
     * Get active orders for current user
     */
    getActiveOrders: async (): Promise<Order[]> => {
        await mockDelay();

        const activeStatuses = [
            OrderStatus.PLACED,
            OrderStatus.ACCEPTED,
            OrderStatus.PREPARING,
            OrderStatus.READY,
            OrderStatus.OUT_FOR_DELIVERY,
        ];

        return Object.values(mockOrders)
            .filter(order => activeStatuses.includes(order.status))
            .map(order => {
                const timestamps: Partial<Record<OrderStatus, string>> = {
                    [OrderStatus.PLACED]: order.placedAt,
                    [OrderStatus.ACCEPTED]: order.acceptedAt,
                    [OrderStatus.PREPARING]: order.preparingAt,
                    [OrderStatus.READY]: order.readyAt,
                    [OrderStatus.OUT_FOR_DELIVERY]: order.outForDeliveryAt,
                    [OrderStatus.DELIVERED]: order.deliveredAt,
                };
                return {
                    ...order,
                    timeline: generateTimeline(order.status, timestamps),
                };
            });
    },

    /**
     * Cancel order
     * PUT /orders/:id/cancel
     */
    cancelOrder: async (orderId: string): Promise<boolean> => {
        await mockDelay(800);

        const order = mockOrders[orderId];
        if (!order || !order.isCancellable) return false;

        mockOrders[orderId] = {
            ...order,
            status: OrderStatus.CANCELLED,
            cancelledAt: new Date().toISOString(),
            isCancellable: false,
        };

        return true;
    },

    /**
     * Get estimated time remaining
     */
    getEstimatedTimeRemaining: (order: Order): string => {
        const now = new Date();
        const eta = new Date(order.estimatedDeliveryTime);
        const diffMinutes = Math.max(0, Math.floor((eta.getTime() - now.getTime()) / 60000));

        if (diffMinutes === 0) return 'Arriving now';
        if (diffMinutes === 1) return '1 min';
        return `${diffMinutes} mins`;
    },

    /**
     * Format time from timestamp
     */
    formatTime: (timestamp: string): string => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-IN', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    },
};
