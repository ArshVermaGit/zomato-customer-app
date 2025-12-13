import React, { useEffect } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
    FadeInDown
} from 'react-native-reanimated';

interface FadeInViewProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    style?: StyleProp<ViewStyle>;
}

const FadeInView: React.FC<FadeInViewProps> = ({
    children,
    delay = 0,
    duration = 500,
    style
}) => {
    // Alternatively using Layout Animations which are simpler
    return (
        <Animated.View
            entering={FadeInDown.delay(delay).duration(duration)}
            style={style}
        >
            {children}
        </Animated.View>
    );
};

export default FadeInView;
