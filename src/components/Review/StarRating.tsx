/**
 * StarRating Component
 * Animated interactive star rating input
 */

import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Text } from 'react-native';
import { Star } from 'lucide-react-native';
import ReviewService from '../../services/review.service';

interface StarRatingProps {
    rating: number;
    onRatingChange: (rating: number) => void;
    size?: number;
    showLabel?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    onRatingChange,
    size = 40,
    showLabel = true
}) => {
    const scaleAnims = useRef([
        new Animated.Value(1),
        new Animated.Value(1),
        new Animated.Value(1),
        new Animated.Value(1),
        new Animated.Value(1),
    ]).current;

    const { label, color } = ReviewService.getRatingInfo(rating);

    const handlePress = (selectedRating: number) => {
        onRatingChange(selectedRating);

        // Animate the selected star
        Animated.sequence([
            Animated.timing(scaleAnims[selectedRating - 1], {
                toValue: 1.4,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnims[selectedRating - 1], {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }),
        ]).start();
    };

    return (
        <View style={styles.container}>
            <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((starValue) => {
                    const isSelected = starValue <= rating;

                    return (
                        <TouchableOpacity
                            key={starValue}
                            activeOpacity={0.7}
                            onPress={() => handlePress(starValue)}
                            style={styles.starTouch}
                        >
                            <Animated.View style={{ transform: [{ scale: scaleAnims[starValue - 1] }] }}>
                                <Star
                                    size={size}
                                    color={isSelected ? color : '#E0E0E0'}
                                    fill={isSelected ? color : 'transparent'}
                                    strokeWidth={isSelected ? 0 : 2}
                                />
                            </Animated.View>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {showLabel && (
                <Text style={[styles.label, { color: rating > 0 ? color : '#666' }]}>
                    {label}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 10,
    },
    starsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 8,
    },
    starTouch: {
        padding: 4,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 4,
    }
});

export default StarRating;
