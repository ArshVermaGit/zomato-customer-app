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
                url: '/orders', // Endpoint for listing orders
                method: 'GET',
                params: params || {},
            }),
            providesTags: ['Orders'],
        }),
        getActiveOrder: builder.query<Order, void>({
            query: () => ({
                url: '/orders/active',
                method: 'GET',
            }),
            providesTags: ['Orders'],
            // Poll every 10 seconds for active order updates
            pollingInterval: 10000,
        }),
        getOrderStatus: builder.query<Order, string>({
            query: (id) => ({
                url: `/orders/${id}`,
                method: 'GET',
            }),
            // Poll every 5 seconds for specific order updates
            pollingInterval: 5000,
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrderHistoryQuery,
    useGetActiveOrderQuery,
    useGetOrderStatusQuery
} = ordersApi;
