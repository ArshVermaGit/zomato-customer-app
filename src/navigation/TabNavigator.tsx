/**
 * Tab Navigator
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import { OrderHistoryScreen } from '../screens/Order';
import { ProfileScreen } from '../screens/Profile'; // Ensure this is exported
import CustomTabBar from '../components/Navigation/CustomTabBar';

export type TabParamList = {
    Home: undefined;
    Search: undefined;
    Orders: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ tabBarLabel: 'Home' }}
            />
            <Tab.Screen
                name="Search"
                component={SearchScreen}
                options={{ tabBarLabel: 'Search' }}
            />
            <Tab.Screen
                name="Orders"
                component={OrderHistoryScreen}
                options={{ tabBarLabel: 'Orders' }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ tabBarLabel: 'Profile' }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;
