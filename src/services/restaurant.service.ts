export const RestaurantService = {
    getRestaurantDetails: async (id: string) => {
        // Mock Data
        await new Promise(resolve => setTimeout(() => resolve(true), 500));
        return {
            id,
            name: 'Biryani Blues',
            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
            rating: 4.3,
            cuisine: 'Biryani, Hyderabadi, Mughlai',
            location: 'Cyber Hub, Gurugram',
            deliveryTime: '30-40 min',
            priceForTwo: '₹500 for two',
            offer: 'FLAT ₹125 OFF',
            address: 'Shop 12, Ground Floor, Cyber Hub, DLF Cyber City, Gurugram',
            timings: '11am – 11pm (Today)',
            menu: [
                {
                    title: 'Recommended',
                    data: [
                        {
                            id: '101',
                            name: 'Chicken Biryani Handi',
                            price: 350,
                            description: 'Authentic Hyderabadi Chicken Dum Biryani cooked with secret spices.',
                            isVeg: false,
                            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80',
                            bestseller: true,
                            customizable: true,
                            customization: [
                                {
                                    id: 'size',
                                    name: 'Choose Quantity',
                                    type: 'radio',
                                    required: true,
                                    options: [
                                        { id: 'half', name: 'Half (Serves 1)', price: 0 },
                                        { id: 'full', name: 'Full (Serves 2)', price: 180 },
                                    ]
                                },
                                {
                                    id: 'spice',
                                    name: 'Spice Level',
                                    type: 'radio',
                                    required: true,
                                    options: [
                                        { id: 'mild', name: 'Mild', price: 0 },
                                        { id: 'medium', name: 'Medium', price: 0 },
                                        { id: 'spicy', name: 'Spicy', price: 0 },
                                    ]
                                },
                                {
                                    id: 'addons',
                                    name: 'Add-ons',
                                    type: 'checkbox',
                                    required: false,
                                    options: [
                                        { id: 'egg', name: 'Extra Boiled Egg', price: 20 },
                                        { id: 'raita', name: 'Extra Raita', price: 30 },
                                        { id: 'salan', name: 'Double Salan', price: 40 },
                                    ]
                                }
                            ]
                        },
                        {
                            id: '102',
                            name: 'Paneer Biryani Handi',
                            price: 290,
                            description: 'Fresh paneer marinated in spices and cooked with basmati rice.',
                            isVeg: true,
                            image: 'https://images.unsplash.com/photo-1631515243349-e8d977d33d29?w=400&q=80',
                            bestseller: false,
                            customizable: false,
                        }
                    ]
                },
                {
                    title: 'Starters',
                    data: [
                        {
                            id: '201',
                            name: 'Chicken 65',
                            price: 280,
                            description: 'Spicy, deep-fried chicken dish originating from Hotel Buhari.',
                            isVeg: false,
                            bestseller: true,
                        },
                        {
                            id: '202',
                            name: 'Paneer Tikka',
                            price: 260,
                            description: 'Chunks of paneer marinated in spices and grilled in a tandoor.',
                            isVeg: true,
                        }
                    ]
                }
            ]
        };
    }
};
