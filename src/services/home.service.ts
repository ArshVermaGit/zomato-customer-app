export const HomeService = {
    getNearbyRestaurants: async (lat?: number, lng?: number) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        return [
            {
                id: '1',
                name: 'Burger King',
                image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80',
                rating: 4.2,
                cuisine: 'Burger, Fast Food',
                deliveryTime: '25-30 min',
                priceForTwo: '₹350 for two',
                offer: 'ITEMS AT ₹129',
            },
            {
                id: '2',
                name: 'Pizza Hut',
                image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80',
                rating: 3.9,
                cuisine: 'Pizza, Italian',
                deliveryTime: '30-40 min',
                priceForTwo: '₹600 for two',
                offer: '50% OFF up to ₹100',
            },
            {
                id: '3',
                name: 'Wow! Momo',
                image: 'https://images.unsplash.com/photo-1625223007374-ee17997ca5c3?w=800&q=80',
                rating: 4.1,
                cuisine: 'Momos, Tibetan',
                deliveryTime: '20-25 min',
                priceForTwo: '₹200 for two',
            },
            {
                id: '4',
                name: 'KFC',
                image: 'https://images.unsplash.com/photo-1513639776629-9269d0d9d53d?w=800&q=80',
                rating: 4.0,
                cuisine: 'Burger, Fast Food',
                deliveryTime: '25-30 min',
                priceForTwo: '₹400 for two',
                offer: 'FLAT ₹125 OFF',
            },
            {
                id: '5',
                name: 'Domino\'s Pizza',
                image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
                rating: 3.5,
                cuisine: 'Pizza, Fast Food',
                deliveryTime: '30 min',
                priceForTwo: '₹400 for two',
            }
        ];
    }
};
