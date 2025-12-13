/**
 * Restaurants Slice
 * Manages restaurant lists and favorites state
 * Note: Main data fetching is now handled by RTK Query (restaurantsApi)
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Restaurant } from '../../services/api/restaurantsApi';

interface RestaurantsState {
    favorites: Restaurant[];
    recent: Restaurant[];
    promoted: Restaurant[];
}

const initialState: RestaurantsState = {
    favorites: [],
    recent: [],
    promoted: [],
};

const restaurantsSlice = createSlice({
    name: 'restaurants',
    initialState,
    reducers: {
        toggleFavorite: (state, action: PayloadAction<Restaurant>) => {
            const index = state.favorites.findIndex(r => r.id === action.payload.id);
            if (index >= 0) {
                state.favorites.splice(index, 1);
            } else {
                state.favorites.push(action.payload);
            }
        },
        addToRecent: (state, action: PayloadAction<Restaurant>) => {
            // Keep recent list limited to 10
            const exists = state.recent.find(r => r.id === action.payload.id);
            if (!exists) {
                state.recent.unshift(action.payload);
                if (state.recent.length > 10) state.recent.pop();
            }
        },
        setPromoted: (state, action: PayloadAction<Restaurant[]>) => {
            state.promoted = action.payload;
        },
    },
});

export const { toggleFavorite, addToRecent, setPromoted } = restaurantsSlice.actions;
export default restaurantsSlice.reducer;
