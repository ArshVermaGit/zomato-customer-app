import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolate,
    SharedValue
} from 'react-native-reanimated';
import { colors, typography, spacing } from '@zomato/design-tokens';
import { Button } from '@zomato/ui'; // Assuming Button is exported from UI
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { Utensils, ShoppingBag, Truck } from 'lucide-react-native'; // Illustrations substitute
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'Onboarding'>;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const slides = [
    {
        id: 1,
        title: 'Discover Restaurants Near You',
        description: 'Find the best restaurants, cafes, and bars in your city',
        Icon: Utensils,
        color: '#FFE5E5',
    },
    {
        id: 2,
        title: 'Order Your Favorite Food',
        description: 'Browse menus and order from thousands of restaurants',
        Icon: ShoppingBag,
        color: '#E5F8FF',
    },
    {
        id: 3,
        title: 'Fast Delivery To Your Door',
        description: 'Track your order in real-time and get it delivered hot & fresh',
        Icon: Truck,
        color: '#E8FFE5',
    },
];

const PaginationDot = ({ index, scrollX }: { index: number, scrollX: SharedValue<number> }) => {
    const rStyle = useAnimatedStyle(() => {
        const inputRange = [(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH];
        const dotWidth = interpolate(
            scrollX.value,
            inputRange,
            [8, 20, 8],
            Extrapolate.CLAMP
        );
        const opacity = interpolate(
            scrollX.value,
            inputRange,
            [0.5, 1, 0.5],
            Extrapolate.CLAMP
        );
        return {
            width: dotWidth,
            opacity,
        };
    });

    return (
        <Animated.View style={[styles.dot, rStyle]} />
    );
};

const OnboardingScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x;
        },
    });

    const handleFinish = async () => {
        await AsyncStorage.setItem('isFirstLaunch', 'false');
        navigation.replace('LocationPermission'); // Or Login
    };

    return (
        <View style={styles.container}>
            {/* Slides */}
            <Animated.ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                onMomentumScrollEnd={(event) => {
                    setCurrentIndex(Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH));
                }}
            >
                {slides.map((slide) => (
                    <View key={slide.id} style={[styles.slide, { backgroundColor: slide.color }]}>
                        {/* Illustration */}
                        <View style={styles.illustrationContainer}>
                            {/* Using Icons as illustrations for now, can replace with Images */}
                            <slide.Icon size={120} color={colors.secondary.gray_800} strokeWidth={1.5} />
                        </View>

                        {/* Content */}
                        <View style={styles.content}>
                            <Text style={styles.title}>{slide.title}</Text>
                            <Text style={styles.description}>{slide.description}</Text>
                        </View>
                    </View>
                ))}
            </Animated.ScrollView>

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {slides.map((_, index) => (
                    <PaginationDot key={index} index={index} scrollX={scrollX} />
                ))}
            </View>

            {/* Bottom Actions */}
            <View style={styles.bottomActions}>
                {currentIndex < slides.length - 1 ? (
                    <>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <Button variant="ghost" onPress={handleFinish}>Skip</Button>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Button variant="primary" onPress={() => console.log('Next')}>Next</Button>
                        </View>
                    </>
                ) : (
                    <View style={{ width: '100%' }}>
                        <Button variant="primary" onPress={handleFinish}>Get Started</Button>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.white,
    },
    slide: {
        width: SCREEN_WIDTH,
        flex: 1,
        paddingTop: spacing['5xl'],
        alignItems: 'center',
        justifyContent: 'center',
    },
    illustrationContainer: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing['2xl'],
        paddingBottom: spacing['4xl'],
        alignItems: 'center',
    },
    title: {
        ...typography.display_medium,
        color: colors.secondary.gray_900,
        textAlign: 'center',
        marginBottom: spacing.base,
        fontSize: 28,
    },
    description: {
        ...typography.body_large,
        color: colors.secondary.gray_600,
        textAlign: 'center',
        lineHeight: 24,
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        marginBottom: spacing.xl,
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary.zomato_red,
    },
    bottomActions: {
        flexDirection: 'row',
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xl,
        position: 'absolute',
        bottom: 20,
        width: '100%',
        justifyContent: 'space-between',
    },
});

export default OnboardingScreen;
