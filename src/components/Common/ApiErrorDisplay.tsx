import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AlertCircle, WifiOff, RefreshCcw, ShieldAlert } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '@zomato/design-tokens';
import { ApiError, ErrorCode } from '../../services/api/api.types';

interface Props {
    error: ApiError | any;
    onRetry?: () => void;
    style?: any;
}

/**
 * Reusable component to display API errors with safe formatting and retry logic.
 */
export const ApiErrorDisplay: React.FC<Props> = ({ error, onRetry, style }) => {
    const errorDetails = useMemo(() => {
        const err = error as ApiError;
        if (!err?.code) return { icon: AlertCircle, color: colors.secondary.gray_500, title: 'Unexpected Error', message: 'Something went wrong.' };

        switch (err.code) {
            case ErrorCode.OFFLINE:
            case ErrorCode.NETWORK_ERROR:
                return { icon: WifiOff, color: colors.secondary.gray_600, title: 'Network Connection', message: err.message };
            case ErrorCode.TIMEOUT:
                return { icon: RefreshCcw, color: colors.primary.zomato_red, title: 'Request Timed Out', message: err.message };
            case ErrorCode.UNAUTHORIZED:
            case ErrorCode.FORBIDDEN:
                return { icon: ShieldAlert, color: colors.primary.zomato_red, title: 'Access Denied', message: err.message };
            default:
                return { icon: AlertCircle, color: colors.primary.zomato_red, title: 'Error occurred', message: err.message };
        }
    }, [error]);

    const Icon = errorDetails.icon;

    return (
        <View style={[styles.container, style]}>
            <View style={[styles.iconWrapper, { backgroundColor: errorDetails.color + '10' }]}>
                <Icon color={errorDetails.color} size={32} />
            </View>

            <Text style={styles.title}>{errorDetails.title}</Text>
            <Text style={styles.message}>{errorDetails.message}</Text>

            {onRetry && (
                <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                    <RefreshCcw size={18} color={colors.secondary.white} />
                    <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.secondary.white,
        borderRadius: borderRadius.lg,
    },
    iconWrapper: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.h4,
        color: colors.secondary.gray_900,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    message: {
        ...typography.body_medium,
        color: colors.secondary.gray_600,
        textAlign: 'center',
        marginBottom: spacing.xl,
        lineHeight: 20,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary.zomato_red,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        gap: spacing.sm,
    },
    retryText: {
        ...typography.label_medium,
        color: colors.secondary.white,
        fontWeight: '700',
    },
});
