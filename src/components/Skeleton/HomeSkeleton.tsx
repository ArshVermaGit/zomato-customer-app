import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ShimmerPlaceholder } from '@zomato/ui';
import { colors, spacing, borderRadius } from '@zomato/design-tokens';

const { width } = Dimensions.get('window');

const HomeSkeleton = () => {
    return (
        <View style={styles.container}>
            {/* Header / Location Shimmer */}
            <View style={styles.header}>
                <ShimmerPlaceholder width={200} height={20} style={{ marginBottom: 8 }} />
                <ShimmerPlaceholder width={width - 32} height={48} style={{ borderRadius: borderRadius.lg }} />
            </View>

            {/* Promo Carousel Shimmers */}
            <View style={styles.section}>
                <View style={{ flexDirection: 'row' }}>
                    <ShimmerPlaceholder width={width * 0.8} height={140} style={{ marginRight: 16, borderRadius: borderRadius.xl }} />
                    <ShimmerPlaceholder width={width * 0.8} height={140} style={{ borderRadius: borderRadius.xl }} />
                </View>
            </View>

            {/* Category Circles */}
            <View style={styles.section}>
                <ShimmerPlaceholder width={150} height={20} style={{ marginBottom: 16 }} />
                <View style={{ flexDirection: 'row' }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <View key={i} style={{ alignItems: 'center', marginRight: 24 }}>
                            <ShimmerPlaceholder width={60} height={60} style={{ borderRadius: 30, marginBottom: 8 }} />
                            <ShimmerPlaceholder width={40} height={10} />
                        </View>
                    ))}
                </View>
            </View>

            {/* Restaurant Cards */}
            <View style={styles.section}>
                <ShimmerPlaceholder width={200} height={24} style={{ marginBottom: 16 }} />
                {[1, 2].map((i) => (
                    <View key={i} style={{ marginBottom: 24 }}>
                        <ShimmerPlaceholder width={'100%'} height={200} style={{ borderRadius: borderRadius.xl, marginBottom: 12 }} />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <ShimmerPlaceholder width={'60%'} height={20} />
                            <ShimmerPlaceholder width={'20%'} height={20} />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.white,
    },
    header: {
        padding: spacing.md,
        paddingTop: 60, // Safe area approx
    },
    section: {
        padding: spacing.md,
        paddingTop: 0,
        marginBottom: spacing.md,
    },
});

export default HomeSkeleton;
