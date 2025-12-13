import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WifiOff } from 'lucide-react-native';
import { useNetwork } from '../../context/NetworkContext';

const OfflineBanner = () => {
    const { isConnected } = useNetwork();
    const insets = useSafeAreaInsets();
    const height = useSharedValue(0);

    useEffect(() => {
        if (!isConnected) {
            height.value = withTiming(40 + insets.top, { duration: 300 });
        } else {
            height.value = withTiming(0, { duration: 300 });
        }
    }, [isConnected, insets.top]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: height.value,
        };
    });

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            <View style={[styles.content, { paddingTop: insets.top }]}>
                <WifiOff color="#fff" size={16} />
                <Text style={styles.text}>You are offline</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#333',
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: '100%',
        paddingBottom: 4,
    },
    text: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default OfflineBanner;
