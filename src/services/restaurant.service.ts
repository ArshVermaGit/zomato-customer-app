import { RestaurantService as ApiRestaurantService } from '@zomato/api-client';

export const RestaurantService = {
    getRestaurantDetails: async (id: string) => {
        try {
            const [details, menu] = await Promise.all([
                ApiRestaurantService.findOne(id),
                ApiRestaurantService.getMenu(id)
            ]);

            return {
                ...details,
                id: details.id || id,
                name: details.name,
                image: details.coverImage || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
                rating: details.rating || 4.3,
                cuisine: Array.isArray(details.cuisine) ? details.cuisine.join(', ') : (details.cuisine || 'Mughlai'),
                location: details.address || 'Cyber Hub, Gurugram',
                deliveryTime: '30-40 min',
                priceForTwo: `₹${details.priceForTwo || 500} for two`,
                offer: 'FLAT ₹125 OFF',
                address: details.address,
                timings: '11am – 11pm (Today)', // Mock
                menu: menu || [] // Assuming menu structure matches or is adapted in components
            };
        } catch (error) {
            console.error('Failed to fetch restaurant details:', error);
            // Fallback or rethrow? For now fallback to avoid crash during dev without backend
            throw error;
        }
    }
};
