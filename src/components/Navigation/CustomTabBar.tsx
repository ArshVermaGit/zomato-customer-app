/**
 * Custom Tab Bar
 * Displays tabs with icons and badges
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Search, Receipt, User } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    // Check for active order to show badge
    const { activeOrder } = useSelector((state: RootState) => state.order);

    return (
        <View style={styles.container}>
            {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const getIcon = () => {
                    const color = isFocused ? '#E23744' : '#999';
                    const size = 24;

                    switch (route.name) {
                        case 'Home':
                            return <Home color={color} size={size} />;
                        case 'Search':
                            return <Search color={color} size={size} />;
                        case 'Orders':
                            return <Receipt color={color} size={size} />;
                        case 'Profile':
                            return <User color={color} size={size} />;
                        default:
                            return <Home color={color} size={size} />;
                    }
                };

                const label = options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : options.title !== undefined
                        ? options.title
                        : route.name;

                return (
                    <TouchableOpacity
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={(options as any).tabBarTestID}
                        onPress={onPress}
                        style={styles.tab}
                        activeOpacity={0.8}
                    >
                        <View style={styles.iconContainer}>
                            {getIcon()}
                            {route.name === 'Orders' && activeOrder && (
                                <View style={styles.badge} />
                            )}
                        </View>
                        <Text style={[styles.label, isFocused && styles.labelFocused]}>
                            {label as string}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        paddingTop: 10,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        position: 'relative',
        marginBottom: 4,
    },
    label: {
        fontSize: 10,
        color: '#999',
        fontWeight: '500',
    },
    labelFocused: {
        color: '#E23744',
        fontWeight: '700',
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E23744',
        borderWidth: 1,
        borderColor: '#fff',
    },
});

export default CustomTabBar;
