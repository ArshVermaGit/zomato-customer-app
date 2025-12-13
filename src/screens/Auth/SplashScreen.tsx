import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LottieAnimation from '../../components/Animations/LottieAnimation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'Splash'>;

const SplashScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    useEffect(() => {
        const checkAuth = async () => {
            // Simulate check time
            await new Promise(resolve => setTimeout(() => resolve(true), 2000));

            const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
            const token = await AsyncStorage.getItem('authToken');

            if (isFirstLaunch === null) {
                navigation.replace('Onboarding');
            } else if (token) {
                // Navigate to Main App (Not implemented yet - placeholder)
                navigation.replace('Login');
            } else {
                navigation.replace('Login');
            }
        };

        checkAuth();
    }, [navigation]);

    return (
        <View style={styles.container}>
            <LottieAnimation
                source={require('../../assets/animations/zomato-logo.json')}
                width={200}
                height={200}
            />
            <Text style={styles.version}>v1.0.0</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E23744', // Zomato Red
        justifyContent: 'center',
        alignItems: 'center',
    },
    animation: {
        width: 200,
        height: 200,
    },
    version: {
        position: 'absolute',
        bottom: 40,
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    }
});

export default SplashScreen;
