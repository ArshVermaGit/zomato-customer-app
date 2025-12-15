import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { colors, spacing, typography, borderRadius } from '@zomato/design-tokens';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const OrderSuccessScreen = () => {
    const navigation = useNavigation<any>();
    const animation = useRef<LottieView>(null);

    useEffect(() => {
        // Play animation on mount
        if (animation.current) {
            animation.current.play();
        }
    }, []);

    const handleTrackOrder = () => {
        // In real app, replace with ActiveOrder screen with order ID
        // For now, reset to Home or track order
        navigation.navigate('ActiveOrder', { orderId: 'new_order_123' });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <LottieView
                    ref={animation}
                    source={{ uri: 'https://assets5.lottiefiles.com/packages/lf20_s2lryxtd.json' }} // Valid placeholder checkmark URL
                    style={styles.lottie}
                    autoPlay
                    loop={false}
                />

                <Text style={styles.title}>Order Placed Successfully!</Text>
                <Text style={styles.subtitle}>
                    Your food is being prepared. You can track your delivery status in real-time.
                </Text>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Estimated Delivery</Text>
                    <Text style={styles.timeText}>35 - 45 mins</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.trackButton} onPress={handleTrackOrder}>
                    <Text style={styles.trackText}>Track Order</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Main')}>
                    <Text style={styles.homeText}>Go to Home</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.white,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    lottie: {
        width: 200,
        height: 200,
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.h3,
        color: colors.secondary.gray_900,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    subtitle: {
        ...typography.body_medium,
        color: colors.secondary.gray_500,
        textAlign: 'center',
        marginBottom: spacing.xl,
        lineHeight: 22,
    },
    card: {
        backgroundColor: '#F8F8F8',
        padding: spacing.lg,
        borderRadius: borderRadius.xl,
        width: '100%',
        alignItems: 'center',
    },
    cardTitle: {
        ...typography.caption,
        color: colors.secondary.gray_500,
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    timeText: {
        ...typography.h2,
        color: colors.secondary.gray_900,
    },
    footer: {
        padding: spacing.xl,
        gap: spacing.md,
    },
    trackButton: {
        backgroundColor: colors.primary.zomato_red,
        paddingVertical: 16,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        shadowColor: colors.primary.zomato_red,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    trackText: {
        ...typography.h4,
        color: colors.secondary.white,
    },
    homeButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    homeText: {
        ...typography.body_large,
        color: colors.secondary.gray_600,
        fontWeight: '600',
    },
});

export default OrderSuccessScreen;
