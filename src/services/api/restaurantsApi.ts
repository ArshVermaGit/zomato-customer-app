import { api } from './baseApi';

export interface Restaurant {
    id: string;
    name: string;
    image: string;
    rating: number;
    deliveryTime: string;
    costForTwo: string;
    cuisines: string[];
    isPromoted?: boolean;
    discount?: string;
}

export interface RestaurantDetail extends Restaurant {
    menu: MenuCategory[];
    address: string;
    coordinates: { lat: number; lng: number };
}

export interface MenuCategory {
    id: string;
    name: string;
    items: MenuItem[];
}

export interface MenuItem {
    id: string;
    name: string;
    price: number;
    description?: string;
    image?: string;
    isVeg: boolean;
    isBestseller?: boolean;
}

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
