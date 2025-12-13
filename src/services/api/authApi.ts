import { api } from './index';
import { UserProfile, UserState } from '../../types/user.types';

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<{ token: string; user: UserProfile }, { phone: string; otp: string }>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                data: credentials,
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
        // Register/Signup
        signup: builder.mutation<{ token: string; user: UserProfile }, { phone: string; name: string }>({
            query: (data) => ({
                url: '/auth/register',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['User'],
        }),
        getProfile: builder.query<UserProfile, void>({
            query: () => ({
                url: '/user/profile',
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
    }),
});

export const { useLoginMutation, useLogoutMutation, useSignupMutation, useGetProfileQuery } = authApi;
