import { Order, OrderStatus, OrderStatusInfo } from '../types/order.types';
import { OrderFilter, DateRangeFilter, OrderHistoryResponse } from '../types/history.types';

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
        { id: 'r1', name: 'Burger King', imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', address: 'Connaught Place' },
        { id: 'r2', name: 'Domino\'s Pizza', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', address: 'Sector 18' },
        { id: 'r3', name: 'Haldiram\'s', imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', address: 'Chandni Chowk' },
        { id: 'r4', name: 'Starbucks', imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400', address: 'Cyber Hub' },
    ];

    for (let i = 1; i <= 20; i++) {
        const rest = restaurants[Math.floor(Math.random() * restaurants.length)];
        const isDelivered = Math.random() > 0.1; // 90% delivered, 10% cancelled
        const placedAt = getRandomDate(60);

        orders.push({
            id: `hist_${i}`,
            userId: 'user_1',
            restaurantId: rest.id,
            orderNumber: `ZMT${200000 + i}`,
            status: isDelivered ? OrderStatus.DELIVERED : OrderStatus.CANCELLED,
            items: [
                { menuItemId: `i_${i}_1`, name: 'Delicious Item ' + i, quantity: 1, price: 150 + i * 10, isVeg: Math.random() > 0.5 },
                { menuItemId: `i_${i}_2`, name: 'Extra Side ' + i, quantity: 2, price: 50, isVeg: true },
            ],
            restaurant: {
                id: rest.id,
                name: rest.name,
                imageUrl: rest.imageUrl,
                address: rest.address,
                phone: '+91 99999 88888',
                latitude: 28.5 + Math.random() * 0.1,
                longitude: 77.2 + Math.random() * 0.1,
                rating: 4.0,
                deliveryTime: 35,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                cuisineTypes: ['Various'],
                email: 'rest@zomato.com',
                totalRatings: 50,
                preparationTime: 20,
                costForTwo: 500,
                minimumOrder: 100,
                deliveryFee: 30,
                deliveryRadius: 5,
                partnerId: 'partner_h',
                images: [rest.imageUrl],
                location: {
                    lat: 28.5 + Math.random() * 0.1,
                    lng: 77.2 + Math.random() * 0.1,
                    address: rest.address,
                },
                isActive: true,
                isOpen: true,
            },
            customerAddress: '42, Sunrise Apartments, New Delhi',
            customerLatitude: 28.55,
            customerLongitude: 77.25,
            timeline: [], // Populated on detail view usually
            placedAt,
            createdAt: placedAt,
            updatedAt: placedAt,
            itemsTotal: 250 + i * 10,
            deliveryFee: 30,
            taxes: 15,
            discount: 0,
            grandTotal: 295 + i * 10,
            totalAmount: 295 + i * 10,
            estimatedDeliveryTime: '', // Not relevant for history
            isCancellable: false,
            canReorder: true,
            paymentStatus: 'COMPLETED',
            deliveryAddress: '42, Sunrise Apartments, New Delhi',
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
                (o.restaurant?.name?.toLowerCase().includes(q) ?? false) ||
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
            OrderStatus.PENDING,
            OrderStatus.CONFIRMED,
            OrderStatus.PREPARING,
            OrderStatus.READY,
            OrderStatus.PICKED_UP,
            OrderStatus.DELIVERED,
        ];

        const currentIndex = statusOrder.indexOf(order.status);

        const timeline = statusOrder.map((status, index) => {
            const info = OrderStatusInfo[status];
            return {
                status,
                time: index <= currentIndex ? new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                timestamp: index <= currentIndex ? (index === currentIndex ? (order.deliveredAt || order.placedAt) : order.placedAt) : '',
                title: info.label,
                description: info.description,
                isCompleted: index < currentIndex,
                isCurrent: index === currentIndex,
            };
        });

        return { ...order, timeline };
    },

    /**
     * Reorder valid check
     */
    canReorder: async (_orderId: string): Promise<boolean> => {
        await mockDelay(500);
        return true; // Always allow for demo
    }
};
