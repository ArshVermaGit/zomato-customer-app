import {
    ApiError as SharedApiError,
    ApiResponse as SharedApiResponse,
    ErrorCode,
    User as SharedUser,
    Order as SharedOrder,
    OrderItem as SharedOrderItem
} from '@zomato/shared-types';

import { Restaurant as SharedRestaurant } from '@zomato/shared-types';

/**
 * Re-exporting shared types to maintain local interface while ensuring contract sync
 */
export { ErrorCode };

export interface ApiError extends Omit<SharedApiError, 'status'> {
    status?: number; // Keep optional for now to avoid breaking existing code
}

export type ApiResponse<T> = SharedApiResponse<T>;
export type PaginatedResponse<T> = ApiResponse<T[]>;

/**
 * Enhanced Domain Types (Extending Shared Types)
 */

export interface User extends SharedUser {
    phoneNumber?: string;
    avatarUrl?: string;
}

export interface Restaurant extends Omit<SharedRestaurant, 'phone'> {
    description?: string;
    deliveryTime: number;
    imageUrl?: string;
    image?: string; // Compatibility
    address?: string;
    phone?: string;
    latitude: number;
    longitude: number;
    cuisine?: string[]; // Compat with cuisineTypes
}

export interface DeliveryPartner {
    id: string; // Ensure id is present
    name: string;
    phoneNumber: string;
    phone?: string; // Compatibility
    photo?: string; // Compatibility
    vehicleNumber?: string;
    vehicleType?: 'bike' | 'scooter' | 'bicycle';
    avatarUrl?: string;
    rating: number;
    latitude: number;
    longitude: number;
}

export interface DeliveryLocationUpdate {
    latitude: number;
    longitude: number;
    heading: number;
    speed: number;
    timestamp: string;
}

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    PREPARING = 'PREPARING',
    READY = 'READY',
    PICKED_UP = 'PICKED_UP',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

export interface OrderItem extends SharedOrderItem {
    id?: string;
    isVeg: boolean;
}

export interface OrderTimelineEvent {
    status: OrderStatus;
    time: string;
    timestamp?: string; // Compatibility
    title: string;
    description?: string;
    isCompleted: boolean;
    isCurrent: boolean;
}

export interface Order extends Omit<SharedOrder, 'status' | 'items'> {
    orderNumber: string;
    status: OrderStatus;
    items: OrderItem[];
    restaurant?: Restaurant;
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
    driverLocation?: DeliveryLocationUpdate;

    // Flags
    isCancellable: boolean;
    canReorder: boolean;
}

export const OrderStatusInfo: Record<OrderStatus, { label: string; description: string; icon: string }> = {
    [OrderStatus.PENDING]: {
        label: 'Order Placed',
        description: 'Your order has been received',
        icon: 'CheckCircle'
    },
    [OrderStatus.CONFIRMED]: {
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
    [OrderStatus.PICKED_UP]: {
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
