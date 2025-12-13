import React, { useState } from 'react';
import { StyleSheet, View, StyleProp, ImageStyle } from 'react-native';
import FastImage, { FastImageProps } from 'react-native-fast-image';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface OptimizedImageProps extends Omit<FastImageProps, 'onLoad' | 'onError' | 'style'> {
    thumbnailSource?: FastImageProps['source'];
    style?: StyleProp<ImageStyle>;
    showLoader?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
    source,
    thumbnailSource,
    style,
    resizeMode = FastImage.resizeMode.cover,
    ...props
}) => {
    const opacity = useSharedValue(0);
    const [error, setError] = useState(false);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    const onLoad = () => {
        opacity.value = withTiming(1, { duration: 300 });
    };

    if (error) {
        // Fallback or placeholder style could go here
        return <View style={[style, styles.placeholder]} />;
    }

    return (
        <View style={[style, styles.container]}>
            {/* Display placeholder/thumbnail if needed */}
            <View style={[StyleSheet.absoluteFill, styles.placeholder]} />

            <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
                <FastImage
                    style={[StyleSheet.absoluteFill]}
                    source={source}
                    resizeMode={resizeMode}
                    onLoad={onLoad}
                    onError={() => setError(true)}
                    {...props}
                />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    placeholder: {
        backgroundColor: '#e1e4e8',
        width: '100%',
        height: '100%',
    },
});

export default OptimizedImage;
