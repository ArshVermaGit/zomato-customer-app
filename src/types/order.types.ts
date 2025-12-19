/**
 * Order Types
 * Types for order tracking, delivery, and real-time updates
 */

import {
    Order as ApiOrder,
    OrderStatus as ApiOrderStatus,
    OrderItem as ApiOrderItem,
    Restaurant as ApiRestaurant,
    DeliveryPartner as ApiDeliveryPartner,
    OrderTimelineEvent as ApiOrderTimelineEvent,
    DeliveryLocationUpdate as ApiDeliveryLocationUpdate,
    OrderStatusInfo as ApiOrderStatusInfo
} from '../services/api/api.types';

// Re-export standardized types
export type Order = ApiOrder;
export type OrderItem = ApiOrderItem;
export type OrderRestaurant = ApiRestaurant;
export type DeliveryPartner = ApiDeliveryPartner;
export type OrderTimelineEvent = ApiOrderTimelineEvent;
export type DeliveryLocationUpdate = ApiDeliveryLocationUpdate;

export {
    ApiOrderStatus as OrderStatus,
    ApiOrderStatusInfo as OrderStatusInfo
};

export interface OrderHistoryParams {
    page?: number;
    limit?: number;
    status?: ApiOrderStatus;
}

// Order tracking data
export interface OrderTracking {
    orderId: string;
    currentStatus: ApiOrderStatus;
    estimatedDeliveryTime: string;
    distanceRemaining?: string;
    deliveryPartner?: ApiDeliveryPartner;
    lastLocationUpdate?: ApiDeliveryLocationUpdate;
}


// Order state for Redux
export interface OrderState {
    activeOrder: ApiOrder | null;
    orderHistory: ApiOrder[];
    isLoading: boolean;
    error: string | null;
    // Real-time tracking
    deliveryPartnerLocation: ApiDeliveryLocationUpdate | null;
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
