/**
 * Review Types
 * Definitions for rating and review data structures
 */

import { DeliveryPartner } from './order.types';

export enum ReviewTag {
    GREAT_FOOD = 'Great Food',
    FAST_DELIVERY = 'Fast Delivery',
    GOOD_PACKAGING = 'Good Packaging',
    FRESH_FOOD = 'Fresh Food',
    VALUE_FOR_MONEY = 'Value for Money',
    BLAND_FOOD = 'Bland Food',
    LATE_DELIVERY = 'Late Delivery',
    BAD_PACKAGING = 'Bad Packaging',
}

export interface StarRating {
    rating: number; // 1-5
    label: string; // e.g., "Terrible", "Bad", "Okay", "Good", "Excellent"
    color: string; // Hex color code
}

export interface ReviewPhoto {
    id: string;
    uri: string;
    fileName?: string;
    type?: string;
}

export interface SubmitReviewRequest {
    orderId: string;
    restaurantId: string;
    rating: number; // 1-5
    tags: ReviewTag[];
    comment?: string;
    photos: ReviewPhoto[];
    deliveryPartnerRating?: {
        partnerId: string;
        rating: number; // 1-5
        comment?: string;
    };
}

export interface ReviewResponse {
    success: boolean;
    message: string;
    pointsEarned?: number;
}

export interface DeliveryPartnerRatingProps {
    partner: DeliveryPartner;
    rating: number;
    onRatingChange: (rating: number) => void;
}
