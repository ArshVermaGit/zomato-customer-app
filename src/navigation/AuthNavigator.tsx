import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/Auth/SplashScreen';
import OnboardingScreen from '../screens/Auth/OnboardingScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import OTPVerificationScreen from '../screens/Auth/OTPVerificationScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import LocationPermissionScreen from '../screens/Auth/LocationPermissionScreen';

export type AuthStackParamList = {
    Splash: undefined;
    Onboarding: undefined;
    Login: undefined;
    OTPVerification: { phoneNumber: string; countryCode: string };
    Signup: { phoneNumber: string };
    LocationPermission: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;
