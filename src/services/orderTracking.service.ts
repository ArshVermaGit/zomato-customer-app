/**
 * Order Tracking Service
 * Mock API service for order tracking and management
 */

import {
    Order,
    OrderStatus,
    OrderTimelineEvent,
    OrderStatusInfo,
} from '../types/order.types';


// Mock delay
const mockDelay = (ms: number = 500) => new Promise<void>(resolve => setTimeout(resolve, ms));

// Generate timeline from status
const generateTimeline = (currentStatus: OrderStatus, timestamps: Partial<Record<OrderStatus, string>>): OrderTimelineEvent[] => {
    const statusOrder: OrderStatus[] = [
        OrderStatus.PENDING,
        OrderStatus.CONFIRMED,
        OrderStatus.PREPARING,
        OrderStatus.READY,
        OrderStatus.PICKED_UP,
        OrderStatus.DELIVERED,
    ];

    const currentIndex = statusOrder.indexOf(currentStatus);

    return statusOrder.map((status, index) => {
        const info = OrderStatusInfo[status];
        return {
            status,
            time: timestamps[status] ? new Date(timestamps[status]!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
            timestamp: timestamps[status] || '',
            title: info?.label || status,
            description: info?.description,
            isCompleted: index < currentIndex,
            isCurrent: index === currentIndex,
        };
    });
};

// Mock order data
const mockOrders: Record<string, Order> = {
    'order_1': {
        id: 'order_1',
        orderNumber: 'ZMT123456',
        status: OrderStatus.PREPARING,
        items: [
            { menuItemId: '1', name: 'Butter Chicken', quantity: 1, price: 350, isVeg: false },
            { menuItemId: '2', name: 'Garlic Naan', quantity: 2, price: 60, isVeg: true },
            { menuItemId: '3', name: 'Dal Makhani', quantity: 1, price: 220, isVeg: true },
        ],
        restaurant: {
            id: 'rest_1',
            name: 'Punjab Grill',
            imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
            address: 'Connaught Place, New Delhi',
            phone: '+91 98765 43210',
            latitude: 28.6315,
            longitude: 77.2167,
            rating: 4.5,
            deliveryTime: 30,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            cuisineTypes: ['North Indian'],
            email: 'punjab@grill.com',
            totalRatings: 100,
            preparationTime: 20,
            costForTwo: 1200,
            minimumOrder: 200,
            deliveryFee: 40,
            deliveryRadius: 5,
            partnerId: 'partner_1',
            images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'],
            location: {
                lat: 28.6315,
                lng: 77.2167,
                address: 'Connaught Place, New Delhi',
            },
            isActive: true,
            isOpen: true,
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
        userId: 'user_1',
        restaurantId: 'rest_1',
        totalAmount: 772,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentStatus: 'COMPLETED',
        deliveryAddress: '42, Sunrise Apartments, New Delhi',
    },
    'order_2': {
        id: 'order_2',
        orderNumber: 'ZMT789012',
        status: OrderStatus.PICKED_UP,
        items: [
            { menuItemId: '4', name: 'Margherita Pizza', quantity: 1, price: 299, isVeg: true },
            { menuItemId: '5', name: 'Pepperoni Pizza', quantity: 1, price: 399, isVeg: false },
        ],
        restaurant: {
            id: 'rest_2',
            name: 'Pizza Express',
            imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
            address: 'Sector 18, Noida',
            phone: '+91 98765 43211',
            latitude: 28.5707,
            longitude: 77.3219,
            rating: 4.2,
            deliveryTime: 40,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            cuisineTypes: ['Italian'],
            email: 'pizza@express.com',
            totalRatings: 80,
            preparationTime: 25,
            costForTwo: 800,
            minimumOrder: 150,
            deliveryFee: 50,
            deliveryRadius: 7,
            partnerId: 'partner_2',
            images: ['https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400'],
            location: {
                lat: 28.5707,
                lng: 77.3219,
                address: 'Sector 18, Noida',
            },
            isActive: true,
            isOpen: true,
        },
        deliveryPartner: {
            id: 'dp_1',
            name: 'Rahul Kumar',
            avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
            phoneNumber: '+91 98765 12345',
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
        userId: 'user_1',
        restaurantId: 'rest_2',
        totalAmount: 744,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paymentStatus: 'COMPLETED',
        deliveryAddress: '42, Sunrise Apartments, New Delhi',
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
            [OrderStatus.PENDING]: order.placedAt,
            [OrderStatus.CONFIRMED]: order.acceptedAt,
            [OrderStatus.PREPARING]: order.preparingAt,
            [OrderStatus.READY]: order.readyAt,
            [OrderStatus.PICKED_UP]: order.outForDeliveryAt,
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
            OrderStatus.PENDING,
            OrderStatus.CONFIRMED,
            OrderStatus.PREPARING,
            OrderStatus.READY,
            OrderStatus.PICKED_UP,
        ];

        return Object.values(mockOrders)
            .filter(order => activeStatuses.includes(order.status))
            .map(order => {
                const timestamps: Partial<Record<OrderStatus, string>> = {
                    [OrderStatus.PENDING]: order.placedAt,
                    [OrderStatus.CONFIRMED]: order.acceptedAt,
                    [OrderStatus.PREPARING]: order.preparingAt,
                    [OrderStatus.READY]: order.readyAt,
                    [OrderStatus.PICKED_UP]: order.outForDeliveryAt,
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
