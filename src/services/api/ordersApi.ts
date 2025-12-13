import { api } from './index';
import { Order, OrderHistoryParams } from '../../types/order.types';

export const ordersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation<Order, any>({
            query: (orderData) => ({
                url: '/orders',
                method: 'POST',
                data: orderData,
            }),
            invalidatesTags: ['Orders'],
        }),
        getOrderHistory: builder.query<Order[], OrderHistoryParams | void>({
            query: (params) => ({
                url: '/orders/history',
                method: 'GET',
                params: params || {},
            }),
            providesTags: ['Orders'],
        }),
        getOrderStatus: builder.query<Order, string>({
            query: (id) => ({
                url: `/orders/${id}/status`,
                method: 'GET',
            }),
            // Short polling for live updates if WebSocket fails or as fallback
            // pollingInterval: 5000, 
        }),
    }),
});

export const { useCreateOrderMutation, useGetOrderHistoryQuery, useGetOrderStatusQuery } = ordersApi;
