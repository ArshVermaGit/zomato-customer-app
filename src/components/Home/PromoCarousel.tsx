import React, { useRef, useState, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, FlatList } from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 30; // 15px margin on each side

const BANNERS = [
    { id: '1', image: 'https://cdn.dribbble.com/users/107759/screenshots/3693895/attachments/827618/zomato_discount.png' }, // Placeholder
    { id: '2', image: 'https://cdn.dribbble.com/users/61682/screenshots/9869620/media/188f6154c14de0173e27752e25530729.png' },
    { id: '3', image: 'https://i.pinimg.com/originals/11/47/31/1147312356ce0144f2d70377484df7dd.jpg' },
];

const PromoCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    // Auto-scroll logic
    useEffect(() => {
        const interval = setInterval(() => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= BANNERS.length) {
                nextIndex = 0;
            }
            flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            setCurrentIndex(nextIndex);
        }, 4000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={BANNERS}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ marginHorizontal: 15 }} // Add padding to start/end
                snapToInterval={ITEM_WIDTH + 10} // Width + margin
                decelerationRate="fast"
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
                    setCurrentIndex(index);
                }}
                renderItem={({ item }) => (
                    <View style={styles.bannerContainer}>
                        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
                    </View>
                )}
            />
            {/* Dots Indicator */}
            <View style={styles.pagination}>
                {BANNERS.map((_, index) => (
                    <View
                        key={index}
                        style={[styles.dot, { backgroundColor: currentIndex === index ? '#E23744' : '#ccc' }]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
    },
    bannerContainer: {
        width: ITEM_WIDTH,
        height: 180,
        marginRight: 10,
        borderRadius: 15,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 3,
    },
});

export default PromoCarousel;
