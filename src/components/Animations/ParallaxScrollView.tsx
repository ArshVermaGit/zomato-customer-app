import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    interpolate,
    useAnimatedRef,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';

interface ParallaxScrollViewProps {
    children: React.ReactNode;
    headerImage: React.ReactNode;
    headerHeight?: number;
}

const ParallaxScrollView: React.FC<ParallaxScrollViewProps> = ({
    children,
    headerImage,
    headerHeight = 250,
}) => {
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollY = useSharedValue(0);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const headerStyle = useAnimatedStyle(() => {
        return {
            height: headerHeight,
            transform: [
                {
                    translateY: interpolate(
                        scrollY.value,
                        [-headerHeight, 0, headerHeight],
                        [-headerHeight / 2, 0, headerHeight * 0.75]
                    ),
                },
                {
                    scale: interpolate(
                        scrollY.value,
                        [-headerHeight, 0, headerHeight],
                        [2, 1, 1]
                    ),
                },
            ],
        };
    });

    return (
        <View style={styles.container}>
            <Animated.ScrollView
                ref={scrollRef}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                style={styles.scrollView}
                contentContainerStyle={{ paddingTop: headerHeight }}
            >
                {children}
            </Animated.ScrollView>

            <Animated.View style={[styles.header, headerStyle]}>
                {headerImage}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        zIndex: 1,
    },
});

export default ParallaxScrollView;
