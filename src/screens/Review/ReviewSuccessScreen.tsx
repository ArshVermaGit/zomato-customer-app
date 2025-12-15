import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '@zomato/design-tokens';

// Fallback to a success checkmark animation URL if local asset is missing
const SUCCESS_LOTTIE_URL = 'https://assets2.lottiefiles.com/packages/lf20_s2lryxtd.json';

const ReviewSuccessScreen = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { pointsEarned } = route.params || {};

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.popToTop(); // Go back to home after a few seconds
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <LottieView
                    source={{ uri: SUCCESS_LOTTIE_URL }}
                    autoPlay
                    loop={false}
                    style={styles.lottie}
                />

                <Text style={styles.title}>Thank You!</Text>
                <Text style={styles.subtitle}>Your feedback helps us serve you better.</Text>

                {pointsEarned > 0 && (
                    <View style={styles.pointsBadge}>
                        <Text style={styles.pointsText}>+{pointsEarned} Zomato Points</Text>
                    </View>
                )}
            </View>

            <TouchableOpacity style={styles.homeButton} onPress={() => navigation.popToTop()}>
                <Text style={styles.homeButtonText}>Back to Home</Text>
            </TouchableOpacity>
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
        width: 150,
        height: 150,
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.h3,
        color: colors.secondary.gray_900,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.body_medium,
        color: colors.secondary.gray_500,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    pointsBadge: {
        backgroundColor: '#FFF8E1',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        marginTop: spacing.md,
        borderWidth: 1,
        borderColor: '#FFECB3',
    },
    pointsText: {
        ...typography.body_large,
        color: '#FFB300',
        fontWeight: 'bold',
    },
    homeButton: {
        margin: spacing.xl,
        padding: spacing.md,
        alignItems: 'center',
    },
    homeButtonText: {
        ...typography.body_medium,
        color: colors.secondary.gray_500,
        textDecorationLine: 'underline',
    },
});

export default ReviewSuccessScreen;
