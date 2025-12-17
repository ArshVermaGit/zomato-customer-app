import { api } from './index';
import { UserProfile } from '../../types/user.types';

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<{ access_token: string; user: UserProfile }, { phone: string; otp?: string }>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                data: { ...credentials, isCustomer: true }, // Add flag if backend needs it
            }),
            invalidatesTags: ['User'],
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            invalidatesTags: ['User', 'Orders'],
        }),
        signup: builder.mutation<{ access_token: string; user: UserProfile }, { phone: string; name: string; email?: string }>({
            query: (data) => ({
                url: '/auth/register',
                method: 'POST',
                data: { ...data, role: 'CUSTOMER' },
            }),
            invalidatesTags: ['User'],
        }),
        getProfile: builder.query<UserProfile, void>({
            query: () => ({
                url: '/users/profile', // Changed from /user/profile based on standard conventions, will verify
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
    }),
});

export const { useLoginMutation, useLogoutMutation, useSignupMutation, useGetProfileQuery } = authApi;
