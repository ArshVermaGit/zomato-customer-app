import { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for API
import { Platform } from 'react-native';

// Base URL for API
// 10.0.2.2 is the localhost alias for Android Emulator
const BASE_URL = Platform.select({
    android: 'http://10.0.2.2:3000/api',
    ios: 'http://localhost:3000/api',
    default: 'http://localhost:3000/api',
});

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

import Toast from 'react-native-toast-message';

// ... (existing code)

// Response interceptor for global error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
            // Dispatch logout if store was accessible or navigate to login
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
                const result = await axiosInstance({
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

export default axiosInstance;
