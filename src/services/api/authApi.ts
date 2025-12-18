import { api } from './baseApi';
import { User, ApiResponse } from './api.types';

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<ApiResponse<{ user: User; token: string; refreshToken: string }>, any>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                data: credentials,
            }),
            invalidatesTags: ['User'],
        }),
        register: builder.mutation<ApiResponse<{ user: User; token: string; refreshToken: string }>, any>({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                data: userData,
            }),
            invalidatesTags: ['User'],
        }),
        getProfile: builder.query<ApiResponse<User>, void>({
            query: () => '/auth/profile',
            providesTags: ['User'],
        }),
        logout: builder.mutation<ApiResponse<void>, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['User', 'Cart', 'Orders'],
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetProfileQuery,
    useLogoutMutation,
} = authApi;
