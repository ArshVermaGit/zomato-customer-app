import { api } from './baseApi';
import { Restaurant, ApiResponse, PaginatedResponse } from './api.types';

export const restaurantApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getRestaurants: builder.query<PaginatedResponse<Restaurant>, { page?: number; search?: string; cuisine?: string }>({
            query: (params) => ({
                url: '/restaurants',
                method: 'GET',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.data.map(({ id }) => ({ type: 'Restaurants' as const, id })),
                        { type: 'Restaurants', id: 'LIST' },
                    ]
                    : [{ type: 'Restaurants', id: 'LIST' }],
        }),
        getRestaurantById: builder.query<ApiResponse<Restaurant>, string>({
            query: (id) => `/restaurants/${id}`,
            providesTags: (result, error, id) => [{ type: 'Restaurants', id }],
        }),
        getNearbyRestaurants: builder.query<PaginatedResponse<Restaurant>, { lat: number; lng: number }>({
            query: (params) => ({
                url: '/restaurants/nearby',
                method: 'GET',
                params,
            }),
            providesTags: [{ type: 'Restaurants', id: 'NEARBY' }],
        }),
    }),
});

export const {
    useGetRestaurantsQuery,
    useGetRestaurantByIdQuery,
    useGetNearbyRestaurantsQuery,
} = restaurantApi;
