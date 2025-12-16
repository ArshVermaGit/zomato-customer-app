/**
 * User Types
 * Types for user profile, settings, favorites, and offers
 */

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    referralCode: string;
    joinedDate: string;
}

export type User = UserProfile;

export interface FavoriteRestaurant {
    id: string;
    name: string;
    image: string;
    address: string;
    rating: number;
    cuisine: string;
    deliveryTime: string;
}

export interface Offer {
    id: string;
    code: string;
    title: string;
    description: string;
    maxDiscount: number;
    minOrderValue: number;
    validTill: string;
    terms: string[];
}

export interface NotificationSettings {
    orderUpdates: boolean;
    offersAndPromos: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
}

export interface UserState {
    user: UserProfile | null;
    isAuthenticated: boolean;
    favorites: FavoriteRestaurant[];
    offers: Offer[];
    settings: NotificationSettings;
    isLoading: boolean;
    error: string | null;
}
