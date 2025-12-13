/**
 * Order Slice
 * Redux slice for order tracking state management
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type {
    Order,
    OrderState,
    DeliveryLocationUpdate,
    DeliveryPartner,
    OrderStatus,
} from '../../types/order.types';
import { OrderTrackingService } from '../../services/orderTracking.service';
import { OrderHistoryService } from '../../services/orderHistory.service';
import { OrderFilter, OrderHistoryResponse } from '../../types/history.types';

const initialState: OrderState = {
    activeOrder: null,
    orderHistory: [],
    isLoading: false,
    error: null,
    deliveryPartnerLocation: null,
    isConnectedToTracking: false,
    historyPagination: {
        page: 1,
        limit: 10,
        hasMore: true,
    }
};

interface FetchHistoryArgs {
    page?: number;
    filters: OrderFilter;
}

// Async thunks
export const fetchOrder = createAsyncThunk(
    'order/fetchOrder',
    async (orderId: string, { rejectWithValue }) => {
        try {
            const order = await OrderTrackingService.getOrder(orderId);
            if (!order) throw new Error('Order not found');
            return order;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchActiveOrders = createAsyncThunk(
    'order/fetchActiveOrders',
    async (_, { rejectWithValue }) => {
        try {
            const orders = await OrderTrackingService.getActiveOrders();
            return orders;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const cancelOrder = createAsyncThunk(
    'order/cancelOrder',
    async (orderId: string, { rejectWithValue }) => {
        try {
            const success = await OrderTrackingService.cancelOrder(orderId);
            if (!success) throw new Error('Failed to cancel order');
            return orderId;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const fetchHistory = createAsyncThunk(
    'order/fetchHistory',
    async ({ page = 1, filters }: FetchHistoryArgs, { rejectWithValue }) => {
        try {
            const response = await OrderHistoryService.getHistory(page, 10, filters);
            return response;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setActiveOrder: (state, action: PayloadAction<Order | null>) => {
            state.activeOrder = action.payload;
        },

        updateOrderStatus: (state, action: PayloadAction<{ status: OrderStatus; timestamp: string }>) => {
            if (state.activeOrder) {
                state.activeOrder.status = action.payload.status;

                // Update timeline
                state.activeOrder.timeline = state.activeOrder.timeline.map(event => {
                    if (event.status === action.payload.status) {
                        return { ...event, isCurrent: true, isCompleted: false, timestamp: action.payload.timestamp };
                    }
                    if (event.isCurrent && event.status !== action.payload.status) {
                        return { ...event, isCurrent: false, isCompleted: true };
                    }
                    return event;
                });
            }
        },

        updateDeliveryLocation: (state, action: PayloadAction<DeliveryLocationUpdate>) => {
            state.deliveryPartnerLocation = action.payload;

            // Also update delivery partner location if exists
            if (state.activeOrder?.deliveryPartner) {
                state.activeOrder.deliveryPartner.latitude = action.payload.latitude;
                state.activeOrder.deliveryPartner.longitude = action.payload.longitude;
            }
        },

        updateETA: (state, action: PayloadAction<{ minutes: number; distance: string }>) => {
            if (state.activeOrder) {
                const newETA = new Date(Date.now() + action.payload.minutes * 60000).toISOString();
                state.activeOrder.estimatedDeliveryTime = newETA;
            }
        },

        assignDeliveryPartner: (state, action: PayloadAction<DeliveryPartner>) => {
            if (state.activeOrder) {
                state.activeOrder.deliveryPartner = action.payload;
            }
        },

        setOrderCompleted: (state, action: PayloadAction<{ deliveredAt: string }>) => {
            if (state.activeOrder) {
                state.activeOrder.status = 'delivered' as OrderStatus;
                state.activeOrder.deliveredAt = action.payload.deliveredAt;
                state.activeOrder.isCancellable = false;

                // Move to history
                state.orderHistory.unshift(state.activeOrder);
            }
        },

        setTrackingConnected: (state, action: PayloadAction<boolean>) => {
            state.isConnectedToTracking = action.payload;
        },

        clearActiveOrder: (state) => {
            state.activeOrder = null;
            state.deliveryPartnerLocation = null;
            state.isConnectedToTracking = false;
        },

        clearOrderError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch order
        builder
            .addCase(fetchOrder.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.activeOrder = action.payload;
            })
            .addCase(fetchOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch active orders
        builder
            .addCase(fetchActiveOrders.fulfilled, (state, action) => {
                // Set first active order
                if (action.payload.length > 0) {
                    state.activeOrder = action.payload[0];
                }
            });

        // Cancel order
        builder
            .addCase(cancelOrder.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                if (state.activeOrder?.id === action.payload) {
                    state.activeOrder = null;
                }
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch History
        builder
            .addCase(fetchHistory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.pagination.page === 1) {
                    state.orderHistory = action.payload.orders;
                } else {
                    state.orderHistory = [...state.orderHistory, ...action.payload.orders];
                }
                // We could store pagination state here if we added it to interface
            })
            .addCase(fetchHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    setActiveOrder,
    updateOrderStatus,
    updateDeliveryLocation,
    updateETA,
    assignDeliveryPartner,
    setOrderCompleted,
    setTrackingConnected,
    clearActiveOrder,
    clearOrderError,
} = orderSlice.actions;

export default orderSlice.reducer;
