/**
 * Generic API Types for Zomato Ecosystem
 */

export enum ErrorCode {
    NETWORK_ERROR = 'NETWORK_ERROR',
    TIMEOUT = 'TIMEOUT',
    OFFLINE = 'OFFLINE',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    SERVER_ERROR = 'SERVER_ERROR',
    UNKNOWN = 'UNKNOWN',
}

export interface ApiError {
    status?: number;
    code: ErrorCode;
    message: string;
    errors?: Record<string, string[]>;
    timestamp: string;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        lastPage: number;
        hasNextPage: boolean;
    };
}

/**
 * Common Domain Types
 */

export interface User {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    avatarUrl?: string;
}

export interface Restaurant {
    id: string;
    name: string;
    description?: string;
    rating: number;
    deliveryTime: number;
    imageUrl?: string;
    address?: string;
    cuisine: string[];
}

export interface Order {
    id: string;
    orderNumber?: string;
    restaurantId: string;
    items: OrderItem[];
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
}

export interface OrderItem {
    id?: string;
    menuItemId: string;
    name: string;
    quantity: number;
    price: number;
}

export type OrderStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'PREPARING'
    | 'READY'
    | 'PICKED_UP'
    | 'DELIVERED'
    | 'CANCELLED';
