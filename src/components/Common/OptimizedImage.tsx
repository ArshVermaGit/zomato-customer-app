import React, { useState, useMemo } from 'react';
import {
    StyleSheet,
    View,
    StyleProp,
    ImageStyle,
    ViewStyle,
    ActivityIndicator,
} from 'react-native';
import FastImage, {
    FastImageProps,
    Source,
    OnLoadEvent,
} from 'react-native-fast-image';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
} from 'react-native-reanimated';

/**
 * OptimizedImage Props
 * Extends FastImageProps to support additional features like placeholders and fallback behavior.
 */
export interface OptimizedImageProps extends Omit<FastImageProps, 'style' | 'onLoad' | 'onError'> {
    /** Styles to apply to the image and its container */
    style?: StyleProp<ImageStyle>;
    /** Styles for the container View */
    containerStyle?: StyleProp<ViewStyle>;
    /** Source for a low-resolution placeholder image */
    thumbnailSource?: Source | number;
    /** Whether to show a loading indicator while the image is fetching */
    showLoader?: boolean;
    /** Color for the loading indicator */
    loaderColor?: string;
    /** Callback for when the image successfully loads */
    onLoad?: (event: OnLoadEvent) => void;
    /** Callback for when the image fails to load */
    onError?: () => void;
    /** Custom fallback component to show on error */
    fallbackComponent?: React.ReactNode;
    /** Background color for the placeholder state */
    placeholderColor?: string;
}

/**
 * Production-ready OptimizedImage Component
 * Features:
 * - High-performance caching via FastImage
 * - Progressive loading transitions via Reanimated
 * - Error handling with fallbacks
 * - Type-safe props and accessibility support
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
    source,
    thumbnailSource,
    style,
    containerStyle,
    showLoader = false,
    loaderColor = '#EF4F5F', // Zomato Red
    placeholderColor = '#F2F2F2',
    resizeMode = FastImage.resizeMode.cover,
    onLoad: propsOnLoad,
    onError: propsOnError,
    fallbackComponent,
    accessibilityLabel,
    ...props
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const opacity = useSharedValue(0);

    // Animated style for smooth fade-in
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const handleLoad = (event: OnLoadEvent) => {
        setIsLoading(false);
        opacity.value = withTiming(1, {
            duration: 400,
            easing: Easing.out(Easing.exp),
        });
        if (propsOnLoad) propsOnLoad(event);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
        if (propsOnError) propsOnError();
    };

    // Memoize style to avoid unnecessary re-renders
    // Use any for image styles as FastImage has slight typing discrepancies with standard RN ImageStyle
    const containerStyles = useMemo<StyleProp<ViewStyle>>(() => [styles.container, containerStyle, style as any], [containerStyle, style]);
    const imageStyles = useMemo<any>(() => [StyleSheet.absoluteFill, style], [style]);

    return (
        <View
            style={containerStyles}
            accessible={!!accessibilityLabel}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="image"
        >
            {/* Background/Placeholder layer */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: placeholderColor }]} />

            {/* Thumbnail/Placeholder Image (optional) */}
            {thumbnailSource && !hasError && (
                <FastImage
                    style={imageStyles}
                    source={thumbnailSource}
                    resizeMode={resizeMode}
                    tintColor={props.tintColor}
                />
            )}

            {/* Main Image */}
            {!hasError ? (
                <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
                    <FastImage
                        {...props}
                        source={source}
                        style={imageStyles}
                        resizeMode={resizeMode}
                        onLoad={handleLoad}
                        onError={handleError}
                    />
                </Animated.View>
            ) : (
                /* Error/Fallback state */
                <View style={[StyleSheet.absoluteFill, styles.centered]}>
                    {fallbackComponent || (
                        <View style={[StyleSheet.absoluteFill, styles.errorPlaceholder]}>
                            {/* You could add an icon here */}
                        </View>
                    )}
                </View>
            )}

            {/* Loading Indicator */}
            {showLoader && isLoading && (
                <View style={[StyleSheet.absoluteFill, styles.centered]}>
                    <ActivityIndicator color={loaderColor} size="small" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        backgroundColor: '#F2F2F2',
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorPlaceholder: {
        backgroundColor: '#EAEAEA',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default OptimizedImage;
