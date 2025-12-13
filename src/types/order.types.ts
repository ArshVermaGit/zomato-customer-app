/**
 * Order Types
 * Types for order tracking, delivery, and real-time updates
 */

// Order status enum
export enum OrderStatus {
    PLACED = 'placed',
    ACCEPTED = 'accepted',
    PREPARING = 'preparing',
    READY = 'ready',
    OUT_FOR_DELIVERY = 'out_for_delivery',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

// Order status display info
export const OrderStatusInfo: Record<OrderStatus, { label: string; description: string; icon: string }> = {
    [OrderStatus.PLACED]: {
        label: 'Order Placed',
        description: 'Your order has been received',
        icon: 'CheckCircle'
    },
    [OrderStatus.ACCEPTED]: {
        label: 'Order Accepted',
        description: 'Restaurant is preparing your order',
        icon: 'ThumbsUp'
    },
    [OrderStatus.PREPARING]: {
        label: 'Preparing',
        description: 'Your food is being prepared with care',
        icon: 'ChefHat'
    },
    [OrderStatus.READY]: {
        label: 'Ready for Pickup',
        description: 'Your order is ready and waiting',
        icon: 'Package'
    },
    [OrderStatus.OUT_FOR_DELIVERY]: {
        label: 'Out for Delivery',
        description: 'Your order is on its way!',
        icon: 'Bike'
    },
    [OrderStatus.DELIVERED]: {
        label: 'Delivered',
        description: 'Order delivered successfully',
        icon: 'CheckCircle2'
    },
    [OrderStatus.CANCELLED]: {
        label: 'Cancelled',
        description: 'Order was cancelled',
        icon: 'XCircle'
    },
};

export interface OrderHistoryParams {
    page?: number;
    limit?: number;
    status?: OrderStatus;
}

// Order item
export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    isVeg: boolean;
    customizations?: string[];
}

// Restaurant info for order
export interface OrderRestaurant {
    id: string;
    name: string;
    image: string;
    address: string;
    phone?: string;
    latitude: number;
    longitude: number;
}

// Delivery partner
export interface DeliveryPartner {
    id: string;
    name: string;
    photo: string;
    phone: string;
    rating: number;
    vehicleType: 'bike' | 'scooter' | 'bicycle';
    vehicleNumber: string;
    latitude: number;
    longitude: number;
}

// Order timeline event
export interface OrderTimelineEvent {
    status: OrderStatus;
    timestamp: string;
    isCompleted: boolean;
    isCurrent: boolean;
}

// Delivery location update
export interface DeliveryLocationUpdate {
    latitude: number;
    longitude: number;
    heading: number;
    speed: number;
    timestamp: string;
}

// Order tracking data
export interface OrderTracking {
    orderId: string;
    currentStatus: OrderStatus;
    estimatedDeliveryTime: string;
    distanceRemaining?: string;
    deliveryPartner?: DeliveryPartner;
    lastLocationUpdate?: DeliveryLocationUpdate;
}

// Complete order object
export interface Order {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    items: OrderItem[];
    restaurant: OrderRestaurant;
    deliveryPartner?: DeliveryPartner;

    // Customer info
    customerAddress: string;
    customerLatitude: number;
    customerLongitude: number;

    // Timeline
    timeline: OrderTimelineEvent[];

    // Timestamps
    placedAt: string;
    acceptedAt?: string;
    preparingAt?: string;
    readyAt?: string;
    outForDeliveryAt?: string;
    deliveredAt?: string;
    cancelledAt?: string;

    // Pricing
    itemsTotal: number;
    deliveryFee: number;
    taxes: number;
    discount: number;
    grandTotal: number;

    // Delivery
    estimatedDeliveryTime: string;
    actualDeliveryTime?: string;

    // Flags
    isCancellable: boolean;
    canReorder: boolean;
}

// Order state for Redux
export interface OrderState {
    activeOrder: Order | null;
    orderHistory: Order[];
    isLoading: boolean;
    error: string | null;
    // Real-time tracking
    deliveryPartnerLocation: DeliveryLocationUpdate | null;
    isConnectedToTracking: boolean;
    historyPagination?: {
        page: number;
        limit: number;
        hasMore: boolean;
    };
}

// WebSocket message types
export type WSMessageType =
    | 'status_update'
    | 'location_update'
    | 'eta_update'
    | 'partner_assigned'
    | 'order_completed';

export interface WSMessage {
    type: WSMessageType;
    orderId: string;
    payload: any;
    timestamp: string;
}

// Navigation params
export type OrderStackParamList = {
    ActiveOrder: { orderId: string };
    OrderDetails: { orderId: string };
    OrderHistory: undefined;
    RateOrder: { orderId: string };
};
