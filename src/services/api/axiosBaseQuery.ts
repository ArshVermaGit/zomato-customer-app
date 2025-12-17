import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { AxiosRequestConfig, AxiosError } from 'axios';
import { apiClient } from '@zomato/api-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

// Configure shared client interceptors locally for the app
// This ensures we use the same instance but with app-specific logic (storage, toasts)

// Request interceptor to add token
apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            // Dispatch logout if store was accessible or navigate to login
            // For now, clear token
            await AsyncStorage.removeItem('authToken');
        } else if (error.response?.status === 403) {
            Toast.show({
                type: 'error',
                text1: 'Access Denied',
                text2: 'You do not have permission to perform this action.',
            });
        } else if (error.response?.status === 500) {
            Toast.show({
                type: 'error',
                text1: 'Server Error',
                text2: 'Something went wrong on our end. Please try again.',
            });
        } else if (error.message === 'Network Error') {
            Toast.show({
                type: 'error',
                text1: 'Connection Error',
                text2: 'Please check your internet connection.',
            });
        }

        return Promise.reject(error);
    }
);

export const axiosBaseQuery =
    (
        { baseUrl }: { baseUrl: string } = { baseUrl: '' }
    ): BaseQueryFn<
        {
            url: string;
            method: AxiosRequestConfig['method'];
            data?: AxiosRequestConfig['data'];
            params?: AxiosRequestConfig['params'];
        },
        unknown,
        unknown
    > =>
        async ({ url, method, data, params }) => {
            try {
                const result = await apiClient({
                    url: baseUrl + url,
                    method,
                    data,
                    params,
                });
                return { data: result.data };
            } catch (axiosError) {
                let err = axiosError as AxiosError;
                return {
                    error: {
                        status: err.response?.status,
                        data: err.response?.data || err.message,
                    },
                };
            }
        };

export default apiClient;
