import { RestaurantService as ApiRestaurantService } from '@zomato/api-client';

export const HomeService = {
    getNearbyRestaurants: async (lat?: number, lng?: number) => {
        try {
            const restaurants = await ApiRestaurantService.findNearby({
                latitude: lat || 28.4595,
                longitude: lng || 77.0266,
                radius: 10 // km
            });

            // Map backend response to frontend expectations
            return restaurants.map((r: any) => ({
                id: r.id,
                name: r.name,
                image: r.coverImage || 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80',
                rating: r.rating || 4.2,
                cuisine: Array.isArray(r.cuisine) ? r.cuisine.join(', ') : (r.cuisine || 'Fast Food'),
                deliveryTime: '25-30 min', // Mock if missing
                priceForTwo: `₹${r.priceForTwo || 350} for two`,
                offer: 'ITEMS AT ₹129', // Mock
            }));
        } catch (error) {
            console.error('Failed to fetch nearby restaurants:', error);
            return [];
        }
    }
};
