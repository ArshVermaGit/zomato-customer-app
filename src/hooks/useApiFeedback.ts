import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import { ApiError, ErrorCode } from '../services/api/api.types';

/**
 * Standardized hook to handle API success/error feedback via toasts.
 */
export const useApiFeedback = (options: {
    error?: any;
    isSuccess?: boolean;
    successMessage?: string;
    errorMessage?: string;
    onSuccess?: () => void;
    onError?: (error: ApiError) => void;
}) => {
    const { error, isSuccess, successMessage, errorMessage, onSuccess, onError } = options;

    useEffect(() => {
        if (isSuccess) {
            if (successMessage) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: successMessage,
                });
            }
            onSuccess?.();
        }
    }, [isSuccess, successMessage, onSuccess]);

    useEffect(() => {
        if (error) {
            const apiError = error as ApiError;

            // Don't toast for everything, some are handled by ApiErrorDisplay or baseApi
            if (apiError.code === ErrorCode.SERVER_ERROR || apiError.code === ErrorCode.FORBIDDEN) {
                // Handled by baseApi toasts usually, but can be overridden here
            }

            const displayMessage = errorMessage || apiError.message || 'Something went wrong';

            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: displayMessage,
            });

            onError?.(apiError);
        }
    }, [error, errorMessage, onError]);
};
