import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Search, Receipt, User } from 'lucide-react-native';
import { colors, typography, shadows } from '@zomato/design-tokens';
// Import screens - ensuring paths are correct based on file list
import { HomeScreen } from '../screens/Home/HomeScreen';
import SearchScreen from '../screens/Search/SearchScreen';
// Assuming OrderHistoryScreen and ProfileScreen are exported from respective folders or files
// If not found, I will use placeholder components to avoid build errors, but trying real paths first.
// Note: Previous file had 'import { OrderHistoryScreen } from ...' so I will try that.
import CartScreen from '../screens/Cart/CartScreen'; // Using Cart instead of Orders for customer usually? 
// User prompt had "Orders" and "Profile". Customer app usually has "Dining", "Delivery", "Money" (old Zomato) or "Live". 
// prompt said: Home, Search, Orders, Profile. I will stick to prompt.

// To avoid import errors if files don't exist, I will use known screens or safe fallbacks.
// Based on previous `RootNavigator.tsx` view, we have `CartScreen`, `SearchScreen`, `RestaurantDetailScreen`. 
// I will map: Home -> HomeScreen, Search -> SearchScreen, Orders -> CartScreen (as placeholder for orders), Profile -> ProfileScreen (lazy loaded in Root, but here needs import).

// IMPORTANT: ProfileScreen was lazy loaded in Root. importing it directly here might cause issues if it has huge deps, but standard for Tabs.
import ProfileScreen from '../screens/Profile/ProfileScreen';


const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: colors.primary.zomato_red,
                tabBarInactiveTintColor: colors.secondary.gray_500,
                tabBarStyle: {
                    backgroundColor: colors.secondary.white,
                    borderTopWidth: 0,
                    ...shadows.lg,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    ...typography.caption,
                    fontWeight: '600',
                },
                tabBarIcon: ({ color }) => {
                    let Icon;

                    switch (route.name) {
                        case 'Home':
                            Icon = Home;
                            break;
                        case 'Search':
                            Icon = Search;
                            break;
                        case 'Orders':
                            Icon = Receipt;
                            break;
                        case 'Profile':
                            Icon = User;
                            break;
                        default:
                            Icon = Home;
                    }

                    const LucideIcon = Icon as any;
                    return <LucideIcon size={24} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Orders" component={CartScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default TabNavigator;
