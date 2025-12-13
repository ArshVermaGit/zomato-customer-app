import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import LottieView, { LottieViewProps } from 'lottie-react-native';

interface LottieAnimationProps extends Omit<LottieViewProps, 'source'> {
    source: string | { uri: string }; // Accept generic source to handle require() or remote
    width?: number;
    height?: number;
    containerStyle?: StyleProp<ViewStyle>;
}

const LottieAnimation: React.FC<LottieAnimationProps> = ({
    source,
    width = 200,
    height = 200,
    containerStyle,
    style,
    autoPlay = true,
    loop = true,
    ...props
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <LottieView
                source={source}
                style={[{ width, height }, style]}
                autoPlay={autoPlay}
                loop={loop}
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LottieAnimation;
