import { api } from './baseApi';
import { Order, OrderStatus, ApiResponse, PaginatedResponse } from './api.types';

export const ordersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query<PaginatedResponse<Order>, { page?: number; status?: OrderStatus }>({
            query: (params) => ({
                url: '/orders',
                method: 'GET',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Orders' as const, id })),
                        { type: 'Orders', id: 'LIST' },
                    ]
                    : [{ type: 'Orders', id: 'LIST' }],
        }),
        getOrderById: builder.query<ApiResponse<Order>, string>({
            query: (id) => ({ url: `/orders/${id}`, method: 'GET' }),
            providesTags: (_result, _error, id) => [{ type: 'Orders', id }],
        }),
        createOrder: builder.mutation<ApiResponse<Order>, Partial<Order>>({
            query: (orderData) => ({
                url: '/orders',
                method: 'POST',
                data: orderData,
            }),
            invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
        }),
        cancelOrder: builder.mutation<ApiResponse<Order>, string>({
            query: (id) => ({
                url: `/orders/${id}/cancel`,
                method: 'POST',
            }),
            invalidatesTags: (_result, _error, id) => [{ type: 'Orders', id }, { type: 'Orders', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetOrdersQuery,
    useGetOrderByIdQuery,
    useCreateOrderMutation,
    useCancelOrderMutation,
} = ordersApi;
