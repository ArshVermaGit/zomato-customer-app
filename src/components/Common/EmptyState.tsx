import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { WifiOff, ShoppingBag, Search, Bell, Heart, AlertCircle } from 'lucide-react-native';
import LottieAnimation from '../Animations/LottieAnimation';

export type EmptyStateType = 'offline' | 'cart' | 'search' | 'notifications' | 'favorites' | 'generic';

interface EmptyStateProps {
    type?: EmptyStateType;
    title?: string;
    message?: string;
    style?: ViewStyle;
    action?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    type = 'generic',
    title,
    message,
    style,
    action,
}) => {
    const getIcon = () => {
        const props = { size: 60, color: '#ccc' };
        switch (type) {
            case 'offline': return <WifiOff {...props} />;
            case 'cart': return <ShoppingBag {...props} />;
            case 'search': return <Search {...props} />;
            case 'notifications': return <Bell {...props} />;
            case 'favorites': return <Heart {...props} />;
            default: return <AlertCircle {...props} />;
        }
    };

    // Defaults based on type if not provided
    const getDefaultContent = () => {
        switch (type) {
            case 'offline':
                return { t: 'No Internet Connection', m: 'Please check your connection and try again.' };
            case 'cart':
                return { t: 'Your cart is empty', m: 'Add items from restaurants to start your order.' };
            case 'search':
                return { t: 'No results found', m: 'Try searching for something else.' };
            case 'notifications':
                return { t: 'No notifications', m: 'You are all caught up!' };
            case 'favorites':
                return { t: 'No favorites yet', m: 'Mark restaurants as favorite to save them here.' };
            default:
                return { t: 'Nothing here', m: 'We couldn\'t find any data to show.' };
        }
    };

    const content = getDefaultContent();

    return (
        <View style={[styles.container, style]}>
            <View style={styles.iconContainer}>
                {/* 
                   In a real app, we would use specific Lottie files for each state.
                   For now, falling back to Lucide icons if no lottie source is passed. 
                   If lottie was mandatory, we could pass it here.
                 */}
                {getIcon()}
            </View>
            <Text style={styles.title}>{title || content.t}</Text>
            <Text style={styles.message}>{message || content.m}</Text>
            {action && <View style={styles.actionContainer}>{action}</View>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    iconContainer: {
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        lineHeight: 22,
    },
    actionContainer: {
        marginTop: 24,
    },
});

export default EmptyState;
