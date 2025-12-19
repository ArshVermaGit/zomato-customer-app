import { api } from './baseApi';
import { Restaurant as SharedRestaurant, MenuItem as SharedMenuItem } from '@zomato/shared-types';

export type Restaurant = SharedRestaurant;

export interface RestaurantDetail extends Restaurant {
    menuCategories: MenuCategory[];
}

export interface MenuCategory {
    id: string;
    name: string;
    description?: string;
    items: MenuItem[];
}

export type MenuItem = SharedMenuItem;

export const restaurantsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getRestaurants: builder.query<Restaurant[], { lat?: number; lng?: number; query?: string }>({
            query: (params) => ({
                url: '/restaurants',
                method: 'GET',
                params,
            }),
            providesTags: ['Restaurants'],
        }),
        getRestaurantDetails: builder.query<RestaurantDetail, string>({
            query: (id) => ({
                url: `/restaurants/${id}`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetRestaurantsQuery, useGetRestaurantDetailsQuery } = restaurantsApi;
