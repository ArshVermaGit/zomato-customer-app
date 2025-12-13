import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
    id: string; // This might need to be a composite key (itemId + options)
    dishId: string;
    name: string;
    price: number;
    finalPrice: number;
    quantity: number;
    description?: string;
    image?: string;
    isVeg: boolean;
    selections?: Record<string, any>;
    specialRequest?: string;
}

export interface CartState {
    items: CartItem[];
    restaurant: {
        id: string;
        name: string;
        image: string;
        location: string;
    } | null;
    bill: {
        itemTotal: number;
        deliveryFee: number;
        tax: number;
        platformFee: number;
        grandTotal: number;
        discount: number;
        tip: number;
    };
    deliveryAddressId?: string;
    paymentMethod?: string;
    appliedPromo?: string;
}

const initialState: CartState = {
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

const calculateBill = (state: CartState) => {
    const itemTotal = state.items.reduce((sum, item) => sum + (item.finalPrice * item.quantity), 0);
    const platformFee = 5; // Fixed fee for now
    const deliveryFee = itemTotal > 500 ? 0 : 40; // Free delivery above 500
    const tax = Math.round(itemTotal * 0.05); // 5% GST

    state.bill.itemTotal = itemTotal;
    state.bill.platformFee = platformFee;
    state.bill.deliveryFee = deliveryFee;
    state.bill.tax = tax;
    state.bill.grandTotal = itemTotal + deliveryFee + tax + platformFee + (state.bill.tip || 0) - (state.bill.discount || 0);
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<{ item: any, restaurant: any }>) => {
            const { item, restaurant } = action.payload;

            // Check if adding from a different restaurant
            if (state.restaurant && state.restaurant.id !== restaurant.id) {
                if (state.items.length === 0) {
                    state.restaurant = restaurant;
                } else {
                    return; // Fail silently or handle with a check before dispatching
                }
            } else if (!state.restaurant) {
                state.restaurant = restaurant;
            }

            // Check if exact item exists (considering customizations)
            const existingItemIndex = state.items.findIndex(
                i => i.dishId === item.id &&
                    JSON.stringify(i.selections) === JSON.stringify(item.selections)
            );

            if (existingItemIndex >= 0) {
                state.items[existingItemIndex].quantity += item.quantity;
            } else {
                state.items.push({
                    id: Math.random().toString(), // temporary ID
                    dishId: item.id,
                    name: item.name,
                    price: item.price,
                    finalPrice: item.finalPrice || item.price,
                    quantity: item.quantity,
                    description: item.description,
                    image: item.image,
                    isVeg: item.isVeg,
                    selections: item.selections,
                    specialRequest: item.specialRequest
                });
            }
            calculateBill(state);
        },
        removeFromCart: (state, action: PayloadAction<{ id: string }>) => {
            state.items = state.items.filter(item => item.id !== action.payload.id);
            if (state.items.length === 0) {
                state.restaurant = null;
            }
            calculateBill(state);
        },
        updateQuantity: (state, action: PayloadAction<{ id: string, change: number }>) => {
            const item = state.items.find(i => i.id === action.payload.id);
            if (item) {
                item.quantity += action.payload.change;
                if (item.quantity <= 0) {
                    state.items = state.items.filter(i => i.id !== action.payload.id);
                }
            }
            if (state.items.length === 0) {
                state.restaurant = null;
            }
            calculateBill(state);
        },
        setTip: (state, action: PayloadAction<number>) => {
            state.bill.tip = action.payload;
            calculateBill(state);
        },
        clearCart: (state) => {
            state.items = [];
            state.restaurant = null;
            state.bill = initialState.bill;
            state.appliedPromo = undefined;
        },
        setDeliveryAddress: (state, action: PayloadAction<string>) => {
            state.deliveryAddressId = action.payload;
        },
        setPaymentMethod: (state, action: PayloadAction<string>) => {
            state.paymentMethod = action.payload;
        },
        applyPromo: (state, action: PayloadAction<{ code: string; discountAmount: number }>) => {
            state.appliedPromo = action.payload.code;
            state.bill.discount = action.payload.discountAmount;
            calculateBill(state);
        },
        removePromo: (state) => {
            state.appliedPromo = undefined;
            state.bill.discount = 0;
            calculateBill(state);
        }
    },
    selectors: {
        selectCartItems: (state) => state.items,
        selectCartTotal: (state) => state.bill.grandTotal,
        selectCartCount: (state) => state.items.reduce((acc, item) => acc + item.quantity, 0),
        selectCartRestaurant: (state) => state.restaurant,
    }
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    setTip,
    clearCart,
    setDeliveryAddress,
    setPaymentMethod,
    applyPromo,
    removePromo
} = cartSlice.actions;

export const { selectCartItems, selectCartTotal, selectCartCount, selectCartRestaurant } = cartSlice.selectors;
export default cartSlice.reducer;
