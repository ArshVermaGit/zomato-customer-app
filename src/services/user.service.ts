import { UserService as ApiUserService } from '@zomato/api-client';
import { UserProfile, FavoriteRestaurant, Offer, NotificationSettings } from '../types/user.types';

const mockDelay = (ms: number = 800) => new Promise(resolve => setTimeout(() => resolve(true), ms));

// Mock Data for Missing APIs
const MOCK_FAVORITES: FavoriteRestaurant[] = [
    {
        id: 'r_1',
        name: 'Punjab Grill',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
        address: 'Connaught Place, New Delhi',
        rating: 4.5,
        cuisine: 'North Indian',
        deliveryTime: '35 mins',
    },
    {
        id: 'r_2',
        name: 'Pizza Express',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
        address: 'Sector 18, Noida',
        rating: 4.2,
        cuisine: 'Italian',
        deliveryTime: '45 mins',
    },
];

const MOCK_OFFERS: Offer[] = [
    {
        id: 'o_1',
        code: 'TRYNEW',
        title: '60% OFF',
        description: 'Get 60% off up to ₹120',
        maxDiscount: 120,
        minOrderValue: 200,
        validTill: '2025-12-31T23:59:59Z',
        terms: ['Valid for new customers', 'Max discount ₹120', 'No min order value'],
    },
    {
        id: 'o_2',
        code: 'ZOMATO50',
        title: '50% OFF',
        description: 'Get 50% off up to ₹100',
        maxDiscount: 100,
        minOrderValue: 159,
        validTill: '2025-12-31T23:59:59Z',
        terms: ['Valid on select restaurants', 'Max discount ₹100'],
    },
];

let MOCK_SETTINGS: NotificationSettings = {
    orderUpdates: true,
    offersAndPromos: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
};

export const UserService = {
    /**
     * Get user profile
     */
    getUserProfile: async (): Promise<UserProfile> => {
        try {
            const profile = await ApiUserService.getProfile();
            return {
                id: profile.id,
                name: profile.name,
                email: profile.email,
                phone: profile.phoneNumber,
                avatar: profile.avatar || 'https://via.placeholder.com/150',
                referralCode: 'ZM' + profile.id.substring(0, 4).toUpperCase(),
                joinedDate: profile.createdAt || new Date().toISOString(),
            };
        } catch (error) {
            console.warn('Failed to fetch profile, using mock fallback', error);
            // Fallback to mock if API fails (e.g. 401 unauth or network)
            await mockDelay();
            return {
                id: 'u_123',
                name: 'Guest User',
                email: 'guest@zomato.com',
                phone: '+91 00000 00000',
                avatar: 'https://via.placeholder.com/150',
                referralCode: 'GUEST',
                joinedDate: new Date().toISOString(),
            };
        }
    },

    /**
     * Update user profile
     */
    updateUserProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
        if (data.name || data.email) {
            const result = await ApiUserService.updateProfile({ name: data.name, email: data.email });
            return {
                id: result.id,
                name: result.name,
                email: result.email,
                phone: result.phoneNumber,
                avatar: result.avatar || 'https://via.placeholder.com/150',
                referralCode: 'ZM' + result.id.substring(0, 4).toUpperCase(),
                joinedDate: result.createdAt,
            };
        }
        return UserService.getUserProfile();
    },

    /**
     * Get user favorites
     */
    getFavorites: async (): Promise<FavoriteRestaurant[]> => {
        await mockDelay();
        return [...MOCK_FAVORITES];
    },

    /**
     * Toggle favorite
     */
    toggleFavorite: async (_restaurantId: string): Promise<FavoriteRestaurant[]> => {
        await mockDelay(500);
        // This is a simplified toggle logic for the demo service
        // In a real app, we'd add/remove based on ID
        // For demo, we just return the list as is but we would mutate it here
        return [...MOCK_FAVORITES];
    },

    /**
     * Remove favorite (specific for Favorite Screen)
     */
    removeFavorite: async (restaurantId: string): Promise<FavoriteRestaurant[]> => {
        await mockDelay(500);
        const index = MOCK_FAVORITES.findIndex(f => f.id === restaurantId);
        if (index !== -1) {
            MOCK_FAVORITES.splice(index, 1);
        }
        return [...MOCK_FAVORITES];
    },

    /**
     * Get available offers
     */
    getOffers: async (): Promise<Offer[]> => {
        await mockDelay();
        return [...MOCK_OFFERS];
    },

    /**
     * Update Settings
     */
    updateSettings: async (settings: Partial<NotificationSettings>): Promise<NotificationSettings> => {
        await mockDelay(500);
        MOCK_SETTINGS = { ...MOCK_SETTINGS, ...settings };
        return { ...MOCK_SETTINGS };
    }
};
