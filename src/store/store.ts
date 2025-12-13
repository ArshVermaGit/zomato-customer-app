import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import cartReducer from './slices/cartSlice';
import addressReducer from './slices/addressSlice';
import orderReducer from './slices/orderSlice';
import authReducer from './slices/authSlice';
import notificationReducer from './slices/notificationSlice';
import chatReducer from './slices/chatSlice';
import restaurantsReducer from './slices/restaurantsSlice';
import { api } from '../services/api';

const rootReducer = combineReducers({
    cart: cartReducer,
    address: addressReducer,
    order: orderReducer,
    auth: authReducer,
    notification: notificationReducer,
    chat: chatReducer,
    restaurants: restaurantsReducer,
    [api.reducerPath]: api.reducer,
});

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['cart', 'address', 'auth', 'restaurants', 'api'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Required for redux-persist
        }).concat(api.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
