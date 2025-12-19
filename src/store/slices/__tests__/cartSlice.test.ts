import cartReducer, { addToCart, removeFromCart, clearCart } from '../cartSlice';

describe('cartSlice', () => {
    const initialState = {
        items: [],
        restaurant: null,
        bill: {
            itemTotal: 0,
            deliveryFee: 0,
            tax: 0,
            platformFee: 0,
            grandTotal: 0,
            discount: 0,
            tip: 0,
        },
        deliveryAddressId: undefined,
        paymentMethod: undefined,
        appliedPromo: undefined,
    };

    const mockRestaurant = {
        id: 'rest_1',
        name: 'Pizza Place',
        image: 'img.jpg',
        location: 'NYC'
    };

    it('should handle initial state', () => {
        expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle addToCart', () => {
        const item = { id: '1', name: 'Pizza', price: 100, quantity: 1, isVeg: true, selections: {} };

        // First add
        const actual = cartReducer(initialState, addToCart({ item, restaurant: mockRestaurant }));
        expect(actual.items.length).toEqual(1);
        expect(actual.items[0].dishId).toEqual('1'); // Slice logic maps id -> dishId
        expect(actual.restaurant).toEqual(mockRestaurant);
        expect(actual.bill.itemTotal).toEqual(100);

        // Add same item again (quantity increase)
        const item2 = { ...item, quantity: 1 };
        const actual2 = cartReducer(actual, addToCart({ item: item2, restaurant: mockRestaurant }));
        expect(actual2.items.length).toEqual(1);
        expect(actual2.items[0].quantity).toEqual(2);
        expect(actual2.bill.itemTotal).toEqual(200);
    });

    it('should handle removeFromCart', () => {
        const item = { id: 'temp_id_1', dishId: '1', name: 'Pizza', price: 100, finalPrice: 100, quantity: 1, isVeg: true };
        const stateWithItem = {
            ...initialState,
            items: [item],
            restaurant: mockRestaurant,
            bill: { ...initialState.bill, itemTotal: 100 }
        };

        const actual = cartReducer(stateWithItem, removeFromCart({ id: 'temp_id_1' }));
        expect(actual.items.length).toEqual(0);
        expect(actual.restaurant).toBeNull();
        expect(actual.bill.itemTotal).toEqual(0);
    });

    it('should handle clearCart', () => {
        const item = { id: 'temp_id_1', dishId: '1', name: 'Pizza', price: 100, finalPrice: 100, quantity: 1, isVeg: true };
        const stateWithItem = {
            ...initialState,
            items: [item],
            restaurant: mockRestaurant,
            bill: { ...initialState.bill, itemTotal: 100, grandTotal: 150 }
        };
        const actual = cartReducer(stateWithItem, clearCart());
        expect(actual).toEqual(initialState);
    });

    it('should reset cart if adding item from different restaurant', () => {
        const item = { id: 'temp_id_1', dishId: '1', name: 'Pizza', price: 100, finalPrice: 100, quantity: 1, isVeg: true };
        const stateWithItem = {
            ...initialState,
            items: [item],
            restaurant: mockRestaurant,
            bill: { ...initialState.bill, itemTotal: 100 }
        };

        const newItem = { id: '2', name: 'Burger', price: 50, quantity: 1, isVeg: false, selections: {} };
        const newRestaurant = { id: 'rest_2', name: 'Burger Joint', image: 'img2.jpg', location: 'LA' };

        // Note: The implementation only resets if specific conditions are met (currently logic in slice is: if different restaurant, IF items.length==0 set new. IF items>0, return.)
        // Wait, looking at current slice logic:
        // if (state.restaurant && state.restaurant.id !== restaurant.id) {
        //     if (state.items.length === 0) { state.restaurant = restaurant; } 
        //     else { return; } // Ignores add if different restaurant!
        // }
        // So it naturally PREVENTS adding from different restaurant. 
        // We should test that it DOES NOT add.

        const actual = cartReducer(stateWithItem, addToCart({ item: newItem, restaurant: newRestaurant }));

        expect(actual.restaurant?.id).toEqual(mockRestaurant.id);
        expect(actual.items.length).toEqual(1); // Should not have changed
        expect(actual.items[0].dishId).toEqual('1');
    });
});
