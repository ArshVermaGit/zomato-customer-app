import { createApi, retry, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';
import { ErrorCode, ApiError } from './api.types';
import { logger } from '@zomato/shared-utils';

// --- Mutex for Token Refresh ---
class Mutex {
    private promise: Promise<void> | null = null;
    private resolve: (() => void) | null = null;

    async acquire() {
        while (this.promise) {
            await this.promise;
        }
        this.promise = new Promise((resolve) => {
            this.resolve = resolve;
        });
    }

    release() {
        if (this.resolve) {
            this.resolve();
            this.promise = null;
            this.resolve = null;
        }
    }
}

const mutex = new Mutex();
const BASE_URL = process.env.API_URL || 'http://localhost:3000/api';
const TIMEOUT_MS = 15000;

/**
 * Standardized Axios Base Query for RTK Query.
 * Features:
 * - Offline detection
 * - Mutex-based token refresh
 * - Detailed error transformation
 * - Timeout handling
 * - Global error notifications
 */
const axiosBaseQuery = (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
): BaseQueryFn<
    {
        url: string;
        method: AxiosRequestConfig['method'];
        data?: AxiosRequestConfig['data'];
        params?: AxiosRequestConfig['params'];
        headers?: AxiosRequestConfig['headers'];
        timeout?: number;
    },
    unknown,
    ApiError
> => async ({ url, method, data, params, headers, timeout = TIMEOUT_MS }, api, extraOptions) => {
    // 1. Offline Detection
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
        return {
            error: {
                code: ErrorCode.OFFLINE,
                message: 'No internet connection. Please check your network settings.',
                timestamp: new Date().toISOString(),
            },
        };
    }

    try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await axios({
            url: baseUrl + url,
            method,
            data,
            params,
            timeout,
            headers: {
                ...headers,
                Authorization: token ? `Bearer ${token}` : '',
            },
        });
        return { data: response.data };
    } catch (axiosError) {
        const err = axiosError as AxiosError<any>;
        const status = err.response?.status;
        const errorData = err.response?.data;

        // 2. Token Refresh Logic
        if (status === 401) {
            await mutex.acquire();
            try {
                const refreshToken = await AsyncStorage.getItem('refreshToken');
                if (refreshToken) {
                    const refreshResult = await axios.post(`${baseUrl}/auth/refresh`, { refreshToken });
                    if (refreshResult.data.accessToken) {
                        await AsyncStorage.setItem('authToken', refreshResult.data.accessToken);
                        mutex.release();
                        return axiosBaseQuery({ baseUrl })({ url, method, data, params, headers, timeout }, api, extraOptions);
                    }
                }
            } catch (refreshErr) {
                console.error('[BaseApi] Token refresh failed:', refreshErr);
                await AsyncStorage.multiRemove(['authToken', 'refreshToken']);
                // Logic to navigate to login could be handled here or via middleware
            } finally {
                mutex.release();
            }
        }

        // 3. Error Transformation
        let transformedError: ApiError = {
            status,
            code: ErrorCode.UNKNOWN,
            message: errorData?.message || err.message || 'An unexpected error occurred.',
            errors: errorData?.errors,
            timestamp: new Date().toISOString(),
        };

        if (err.code === 'ECONNABORTED') {
            transformedError.code = ErrorCode.TIMEOUT;
            transformedError.message = 'The request timed out. Please try again.';
        } else if (status === 401) {
            transformedError.code = ErrorCode.UNAUTHORIZED;
        } else if (status === 403) {
            transformedError.code = ErrorCode.FORBIDDEN;
            transformedError.message = 'You do not have permission to access this resource.';
        } else if (status && status >= 500) {
            transformedError.code = ErrorCode.SERVER_ERROR;
            transformedError.message = 'A server error occurred. We have been notified.';
        } else if (!status) {
            transformedError.code = ErrorCode.NETWORK_ERROR;
            transformedError.message = 'Network error. Please check your connection.';
        }

        // 4. Global Notifications & Logging
        if (transformedError.code === ErrorCode.SERVER_ERROR) {
            logger.error(`API Server Error: ${url}`, transformedError);
            Toast.show({ type: 'error', text1: 'Server Error', text2: transformedError.message });
        } else if (transformedError.code === ErrorCode.OFFLINE) {
            Toast.show({ type: 'info', text1: 'Offline', text2: transformedError.message });
        } else {
            logger.warn(`API Non-critical failure: ${url}`, transformedError);
        }

        return { error: transformedError };
    }
};

/**
 * Staggered retry logic for resilient data fetching.
 */
const staggeredBaseQuery = retry(
    axiosBaseQuery({ baseUrl: BASE_URL }),
    { maxRetries: 3 }
);

export const api = createApi({
    reducerPath: 'api',
    baseQuery: staggeredBaseQuery,
    tagTypes: ['User', 'Orders', 'Restaurants', 'Cart'],
    endpoints: () => ({}),
});
