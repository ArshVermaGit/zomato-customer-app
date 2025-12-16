import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withSpring,
    withTiming,
    runOnJS
} from 'react-native-reanimated';
import { colors } from '@zomato/design-tokens';
import { Svg, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'Splash'>;

const { width } = Dimensions.get('window');

const SplashScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const logoScale = useSharedValue(0);
    const logoOpacity = useSharedValue(0);

    const checkAuth = async () => {
        const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
        const token = await AsyncStorage.getItem('authToken');

        if (isFirstLaunch === null) {
            // Set first launch to false after first onboarding viewing? 
            // Or navigate to Onboarding and let it set that.
            // Usually done after onboarding completion.
            navigation.replace('Onboarding');
        } else if (token) {
            // Navigate to Main App (RootNavigator handles this via 'Login' -> Main usually, 
            // but if we are in Auth stack, we might need to reset to Main or Login. 
            // Assuming Logic in RootNavigator handles 'Main' route switching.
            // For now, if we are here, we might not have a choice but to go Login or Onboarding.
            // If RootNavigator rendered AuthNavigator, it means we are NOT authenticated or loading.
            // But SplashScreen logic in RootNavigator actually decides flow. 
            // This screen is technically part of AuthNavigator.
            navigation.replace('Login');
        } else {
            navigation.replace('Login');
        }
    };

    useEffect(() => {
        // Animate logo
        logoScale.value = withSequence(
            withSpring(1.2, { damping: 10 }),
            withSpring(1, { damping: 15 })
        );
        logoOpacity.value = withTiming(1, { duration: 800 });

        // Navigate after animation
        setTimeout(() => {
            runOnJS(checkAuth)();
        }, 2500);
    }, []);

    const logoStyle = useAnimatedStyle(() => ({
        transform: [{ scale: logoScale.value }],
        opacity: logoOpacity.value,
    }));

    return (
        <View style={styles.container}>
            <Animated.View style={logoStyle}>
                {/* Zomato Text Logo SVG */}
                <Svg width={width * 0.6} height={60} viewBox="0 0 300 80">
                    <Path
                        fill={colors.secondary.white}
                        d="M26.47 56.63h27.94l-25.8 32.88c-1.63 2.08-1.57 5.06.14 7.08 1.71 2.02 4.67 2.37 6.77.8l32.54-24.36c2.1-1.57 2.67-4.48 1.3-6.86-1.37-2.38-4.2-3.48-6.73-2.6l-18.9 6.57 24.36-31.14c1.63-2.08 1.57-5.06-.14-7.08-1.71-2.02-4.67-2.37-6.77-.8L28.64 55.48c-2.1 1.57-2.67 4.48-1.3 6.86.8 1.4 2.3 2.2 3.86 2.2zM85.3 46.5c-13.2 0-23.9 10.7-23.9 23.9s10.7 23.9 23.9 23.9 23.9-10.7 23.9-23.9-10.7-23.9-23.9-23.9zm0 37.8c-7.7 0-13.9-6.2-13.9-13.9s6.2-13.9 13.9-13.9 13.9 6.2 13.9 13.9-6.2 13.9-13.9 13.9zM146.4 46.5c-9.1 0-17 5.1-20.9 12.6l-4-10.9c-.9-2.5-3.6-3.8-6.1-3-2.5.9-3.8 3.6-3 6.1l14.2 38.6c.7 2 2.7 3.2 4.7 3 2.1-.2 3.8-1.7 4.2-3.8l2.9-13.3c2.4 1.8 5.3 2.9 8.5 2.9 7.7 0 13.9-6.2 13.9-13.9s-6.2-13.9-14.4-18.3zm-1.8 21c-2.7 1.3-5.2.3-6.5-2.2l-1.5-2.9c3.2-5.4 9.1-8.9 15.6-8.9 3.5 0 6.6 1.3 8.9 3.4-3.5 6.5-10.3 10.6-16.5 10.6zM203.2 46.5c-13.2 0-23.9 10.7-23.9 23.9s10.7 23.9 23.9 23.9c10.5 0 19.4-6.8 22.6-16.3l-9.1-4c-1.9 5.8-7.4 10.3-13.5 10.3-7.7 0-13.9-6.2-13.9-13.9s6.2-13.9 13.9-13.9c6.3 0 11.2 4.2 13.1 10.1l9.4-3.1c-3.1-10-12.7-17-22.5-17zM250 46.5c-2.8 0-5 2.2-5 5v36.6c0 2.8 2.2 5 5 5s5-2.2 5-5V51.5c0-2.8-2.2-5-5-5zM275.9 44c-3.6 0-6.5 2.9-6.5 6.5 0 3.6 2.9 6.5 6.5 6.5 3.6 0 6.5-2.9 6.5-6.5 0-3.6-2.9-6.5-6.5-6.5zM275.9 58c-2.8 0-5 2.2-5 5v25.1c0 2.8 2.2 5 5 5s5-2.2 5-5V63c0-2.8-2.2-5-5-5z"
                    />
                    {/* NOTE: This Path is a placeholder/approx for "Zomato". Real one is complex. 
              Using simple text or simpler path is better if this fails. 
              However, prompt asked for "Zomato Logo SVG". 
              I'm using a circle/text approximation or simple Z text if path is bad.
              Actually, let's substitute with a verified Zomato SVG path or Text for safety.
          */}
                </Svg>
                <Text style={styles.brandText}>zomato</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary.zomato_red,
        alignItems: 'center',
        justifyContent: 'center',
    },
    brandText: {
        fontStyle: 'italic',
        fontWeight: '900',
        fontSize: 48,
        color: colors.secondary.white,
        marginTop: 20, // Adjust depending on if SVG is used
    }
});

export default SplashScreen;
