import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import AddressNavigator from './AddressNavigator';
import SplashScreen from '../screens/Auth/SplashScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import SearchResultsScreen from '../screens/Search/SearchResultsScreen';
import RestaurantDetailScreen from '../screens/Restaurant/RestaurantDetailScreen';
import CartScreen from '../screens/Cart/CartScreen';
const ProfileScreen = React.lazy(() => import('../screens/Profile/ProfileScreen'));
const EditProfileScreen = React.lazy(() => import('../screens/Profile/EditProfileScreen'));
const FavoritesScreen = React.lazy(() => import('../screens/Profile/FavoritesScreen'));
const OffersScreen = React.lazy(() => import('../screens/Profile/OffersScreen'));
const ReferEarnScreen = React.lazy(() => import('../screens/Profile/ReferEarnScreen'));
const NotificationSettingsScreen = React.lazy(() => import('../screens/Profile/NotificationSettingsScreen'));
const HelpSupportScreen = React.lazy(() => import('../screens/Profile/HelpSupportScreen'));
const AboutScreen = React.lazy(() => import('../screens/Profile/AboutScreen'));
const NotificationsScreen = React.lazy(() => import('../screens/Notification/NotificationsScreen'));
const ChatScreen = React.lazy(() => import('../screens/Profile/ChatScreen'));

import { NotificationService } from '../services/notification.service';

// Order screens
const ActiveOrderScreen = React.lazy(() => import('../screens/Order/ActiveOrderScreen'));
const RateOrderScreen = React.lazy(() => import('../screens/Review/RateOrderScreen'));

import type { AddressStackParamList } from '../types/address.types';
import type { OrderStackParamList } from '../types/order.types';
import { ActivityIndicator, View } from 'react-native';

export type RootStackParamList = {
    Splash: undefined;
    Auth: undefined;
    Main: undefined;
    Search: undefined;
    SearchResults: { query: string };
    RestaurantDetail: { id: string };
    Cart: undefined;
    // Address screens accessible from anywhere
    Address: undefined;
    AddressList: AddressStackParamList['AddressList'];
    AddAddress: AddressStackParamList['AddAddress'];
    SelectLocationMap: AddressStackParamList['SelectLocationMap'];
    AddressForm: AddressStackParamList['AddressForm'];
    EditAddress: AddressStackParamList['EditAddress'];
    // Order tracking
    ActiveOrder: OrderStackParamList['ActiveOrder'];
    RateOrder: OrderStackParamList['RateOrder'];
    // Profile
    Profile: undefined;
    EditProfile: undefined;
    Favorites: undefined;
    Offers: undefined;
    ReferEarn: undefined;
    NotificationSettings: undefined;
    HelpSupport: undefined;
    About: undefined;
    Notifications: undefined;
    ChatSupport: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [initialRoute, setInitialRoute] = useState<'Auth' | 'Main'>('Auth');

    useEffect(() => {
        const checkToken = async () => {
            try {
                // Request notification permission early
                await NotificationService.requestPermission();

                const token = await AsyncStorage.getItem('authToken');
                // Check if user has passed onboarding
                const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');

                if (token) {
                    setInitialRoute('Main');
                } else {
                    setInitialRoute('Auth');
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        checkToken();
    }, []);

    if (isLoading) {
        return <SplashScreen />; // Or a simple activity indicator
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
            <Stack.Screen name="Auth" component={AuthNavigator} />
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Group screenOptions={{ presentation: 'card' }}>
                <Stack.Screen name="Search" component={SearchScreen} />
                <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
                <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
                <Stack.Screen name="Cart" component={CartScreen} />
            </Stack.Group>
            {/* Address Flow */}
            <Stack.Group screenOptions={{ presentation: 'card' }}>
                <Stack.Screen name="Address" component={AddressNavigator} />
            </Stack.Group>
            {/* Order Tracking */}
            {/* Order Tracking */}
            <Stack.Group screenOptions={{ presentation: 'card' }}>
                <Stack.Screen name="ActiveOrder">
                    {props => <React.Suspense fallback={<View><ActivityIndicator /></View>}><ActiveOrderScreen /></React.Suspense>}
                </Stack.Screen>
                <Stack.Screen
                    name="RateOrder"
                    options={{
                        presentation: 'modal',
                        headerShown: false
                    }}
                >
                    {props => <React.Suspense fallback={<View><ActivityIndicator /></View>}><RateOrderScreen /></React.Suspense>}
                </Stack.Screen>
            </Stack.Group>

            <Stack.Group>
                {/* 
                   Ideally we would wrap the whole navigator or group in Suspense, 
                   but usually React Navigation requires Suspense inside Screen component per screen
                   or a wrapper around the whole app. Per screen is safer for now.
                 */}
                <Stack.Screen name="Profile" options={{ headerShown: false }}>
                    {props => <React.Suspense fallback={<View><ActivityIndicator /></View>}><ProfileScreen /></React.Suspense>}
                </Stack.Screen>
                <Stack.Screen name="EditProfile" options={{ headerShown: false }}>
                    {props => <React.Suspense fallback={<View><ActivityIndicator /></View>}><EditProfileScreen /></React.Suspense>}
                </Stack.Screen>
                <Stack.Screen name="Favorites" options={{ headerShown: false }}>
                    {props => <React.Suspense fallback={<View><ActivityIndicator /></View>}><FavoritesScreen /></React.Suspense>}
                </Stack.Screen>
                <Stack.Screen name="Offers" options={{ headerShown: false }}>
                    {props => <React.Suspense fallback={<View><ActivityIndicator /></View>}><OffersScreen /></React.Suspense>}
                </Stack.Screen>
                <Stack.Screen name="ReferEarn" options={{ headerShown: false }}>
                    {props => <React.Suspense fallback={<View><ActivityIndicator /></View>}><ReferEarnScreen /></React.Suspense>}
                </Stack.Screen>
                <Stack.Screen name="NotificationSettings" options={{ headerShown: false }}>
                    {props => <React.Suspense fallback={<View><ActivityIndicator /></View>}><NotificationSettingsScreen /></React.Suspense>}
                </Stack.Screen>
                <Stack.Screen name="HelpSupport" options={{ headerShown: false }}>
                    {props => <React.Suspense fallback={<View><ActivityIndicator /></View>}><HelpSupportScreen /></React.Suspense>}
                </Stack.Screen>
                <Stack.Screen name="About" options={{ headerShown: false }}>
                    {props => <React.Suspense fallback={<View><ActivityIndicator /></View>}><AboutScreen /></React.Suspense>}
                </Stack.Screen>
                <Stack.Screen name="Notifications" options={{ headerShown: false }}>
                    {props => <React.Suspense fallback={<View><ActivityIndicator /></View>}><NotificationsScreen /></React.Suspense>}
                </Stack.Screen>
                <Stack.Screen name="ChatSupport" options={{ headerShown: false }}>
                    {props => <React.Suspense fallback={<View><ActivityIndicator /></View>}><ChatScreen /></React.Suspense>}
                </Stack.Screen>
            </Stack.Group>
        </Stack.Navigator>
    );
};

export default RootNavigator;
