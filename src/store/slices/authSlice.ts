/**
 * Auth Slice
 * Redux slice for user authentication and profile state
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserProfile, UserState, NotificationSettings } from '../../types/user.types';
import { UserService } from '../../services/user.service';

const initialState: UserState = {
    user: null,
    isAuthenticated: false,
    favorites: [],
    offers: [],
    settings: {
        orderUpdates: true,
        offersAndPromos: true,
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
    },
    isLoading: false,
    error: null,
};

// Async Thunks
export const fetchProfile = createAsyncThunk(
    'auth/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const user = await UserService.getUserProfile();
            return user;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (data: Partial<UserProfile>, { rejectWithValue }) => {
        try {
            const user = await UserService.updateUserProfile(data);
            return user;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchFavorites = createAsyncThunk(
    'auth/fetchFavorites',
    async (_, { rejectWithValue }) => {
        try {
            const favorites = await UserService.getFavorites();
            return favorites;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const removeFavorite = createAsyncThunk(
    'auth/removeFavorite',
    async (restaurantId: string, { rejectWithValue }) => {
        try {
            const favorites = await UserService.removeFavorite(restaurantId);
            return favorites;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchOffers = createAsyncThunk(
    'auth/fetchOffers',
    async (_, { rejectWithValue }) => {
        try {
            const offers = await UserService.getOffers();
            return offers;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const updateSettings = createAsyncThunk(
    'auth/updateSettings',
    async (settings: Partial<NotificationSettings>, { rejectWithValue }) => {
        try {
            const newSettings = await UserService.updateSettings(settings);
            return newSettings;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.favorites = [];
            state.offers = [];
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch Profile
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Update Profile
        builder
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch Favorites
        builder
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.favorites = action.payload;
            });

        // Remove Favorite
        builder
            .addCase(removeFavorite.fulfilled, (state, action) => {
                state.favorites = action.payload;
            });

        // Fetch Offers
        builder
            .addCase(fetchOffers.fulfilled, (state, action) => {
                state.offers = action.payload;
            });

        // Update Settings
        builder
            .addCase(updateSettings.fulfilled, (state, action) => {
                state.settings = action.payload;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
