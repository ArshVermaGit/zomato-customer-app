import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, RefreshControl, Image, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import { MapPin, ChevronDown, Search, Heart, SlidersHorizontal, ChevronRight } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, shadows } from '@zomato/design-tokens';
import { RestaurantCard } from '@zomato/ui';
import { useNavigation } from '@react-navigation/native';
import { HomeService } from '../../services/home.service';
import HomeSkeleton from '../../components/Skeleton/HomeSkeleton';
import { ErrorState } from '@zomato/ui';

const { width } = Dimensions.get('window');

// --- Mock Data for Sub-components ---
const PROMOS = [
    { id: '1', image: 'https://b.zmtcdn.com/data/o2_assets/5dbdb7214e93733c7f9263a5043818e61716538186.png', title: '50% OFF' }, // Placeholder
    { id: '2', image: 'https://b.zmtcdn.com/data/o2_assets/3d90259e8f4989e243447c16223295831610433291.png', title: 'Free Delivery' },
];

const CATEGORIES = [
    { id: '1', name: 'Pizza', image: 'https://b.zmtcdn.com/data/o2_assets/d0bd7c9405ac87f6aa65e31fe55800941632716575.png' },
    { id: '2', name: 'Burger', image: 'https://b.zmtcdn.com/data/dish_images/ccb7dc91f8f3552700ca20d4f49b91011604859068.png' },
    { id: '3', name: 'Biryani', image: 'https://b.zmtcdn.com/data/dish_images/d19a31d42d5913ff129cafd7cec772f81639737697.png' },
    { id: '4', name: 'Thali', image: 'https://b.zmtcdn.com/data/dish_images/197987b7ebcd1ee08f8c25ea4e77e20f1634731334.png' },
    { id: '5', name: 'Chicken', image: 'https://b.zmtcdn.com/data/dish_images/197987b7ebcd1ee08f8c25ea4e77e20f1634731334.png' } // Placeholder reuse
];

// --- Sub Components ---

const LocationHeader = () => (
    <View style={styles.locationHeaderContainer}>
        <View style={styles.locationTopRow}>
            <MapPin size={24} color={colors.primary.zomato_red} fill={colors.primary.zomato_red} />
            <View style={styles.addressContainer}>
                <Text style={styles.deliverToText}>Deliver to Home</Text>
                <View style={styles.addressRow}>
                    <Text style={styles.addressText} numberOfLines={1}>Sector 15, Gurgaon</Text>
                    <ChevronDown size={16} color={colors.secondary.gray_800} />
                </View>
            </View>
            <TouchableOpacity style={styles.profileButton}>
                {/* Profile Placeholder or Initial */}
                <View style={styles.profileCircle}>
                    <Text style={styles.profileInitial}>A</Text>
                </View>
            </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.searchBar}>
            <Search size={20} color={colors.primary.zomato_red} />
            <Text style={styles.searchText}>Restaurant name or a dish...</Text>
            <View style={styles.micBorder} />
            {/* Mic Icon could go here */}
        </TouchableOpacity>
    </View>
);

const PromoCarousel = () => (
    <View style={styles.promoContainer}>
        <FlatList
            horizontal
            data={PROMOS}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.md }}
            renderItem={({ item }) => (
                <View style={styles.promoCard}>
                    <Image source={{ uri: item.image }} style={styles.promoImage} resizeMode="cover" />
                    {/* In real Zomato, these are banners. I'm using squares/rects */}
                    <View style={styles.promoOverlay}>
                        <Text style={styles.promoText}>{item.title}</Text>
                    </View>
                </View>
            )}
        />
    </View>
);

const CategoryRail = () => (
    <View style={styles.categoryContainer}>
        <Text style={styles.sectionTitle}>What's on your mind?</Text>
        <FlatList
            horizontal
            data={CATEGORIES}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.md }}
            renderItem={({ item }) => (
                <View style={styles.categoryItem}>
                    <View style={styles.categoryImageContainer}>
                        <Image source={{ uri: item.image }} style={styles.categoryImage} />
                    </View>
                    <Text style={styles.categoryName} numberOfLines={1}>{item.name}</Text>
                </View>
            )}
        />
    </View>
);

const FilterBar = () => (
    <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterButton}>
            <SlidersHorizontal size={16} color={colors.secondary.gray_800} />
            <Text style={styles.filterText}>Sort</Text>
            <ChevronDown size={14} color={colors.secondary.gray_800} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Near & Fast</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Great Offers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Rating 4.0+</Text>
        </TouchableOpacity>
    </View>
);


// --- Main Screen ---

const HomeScreen = () => {
    const navigation = useNavigation<any>();
    const scrollY = useSharedValue(0);
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const headerStyle = useAnimatedStyle(() => {
        // Simple sticky header effect: 
        // We actually might want the Search Bar to stick?
        // Zomato iOS: Address is at top, Scroll up -> Address Fades/Shrinks, Search Bar eventually sticks.
        // For simplicity: We will let the standard layout handle it, but maybe add a shadow on scroll.
        return {
            elevation: scrollY.value > 10 ? 4 : 0,
            borderBottomWidth: scrollY.value > 10 ? 1 : 0,
            borderBottomColor: colors.secondary.gray_200,
        };
    });

    const fetchData = async () => {
        try {
            setError(false);
            const data = await HomeService.getNearbyRestaurants();
            setRestaurants(data);
        } catch (error) {
            console.error(error);
            setError(true);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const renderHeader = () => (
        <View>
            <PromoCarousel />
            <CategoryRail />
            <View style={styles.sectionStart}>
                <Text style={styles.listTitle}>All {restaurants.length} restaurants around you</Text>
            </View>
            <FilterBar />
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Sticky/Fixed Header Area */}
            <Animated.View style={[styles.staticHeader, headerStyle]}>
                <LocationHeader />
            </Animated.View>

            {loading ? (
                <HomeSkeleton />
            ) : error ? (
                <ErrorState
                    title="Oops! Something went wrong"
                    message="We couldn't load the restaurants. Please try again."
                    onRetry={fetchData}
                />
            ) : (
                <Animated.FlatList
                    data={restaurants}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={{ paddingHorizontal: spacing.md }}>
                            <RestaurantCard
                                restaurant={item}
                                onPress={() => navigation.navigate('RestaurantDetail', { id: item.id })}
                            />
                        </View>
                    )}
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={{ paddingTop: 120, paddingBottom: 100 }} // Top padding for fixed header
                    onScroll={scrollHandler}
                    scrollEventThrottle={16}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary.zomato_red} />
                    }
                />
            )}

            {/* Floating Cart? (If needed later) */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.white,
    },
    centerLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    staticHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.secondary.white,
        zIndex: 100,
        paddingTop: 50, // Safe Area approx
        paddingBottom: spacing.sm,
    },
    locationHeaderContainer: {
        paddingHorizontal: spacing.md,
    },
    locationTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    addressContainer: {
        flex: 1,
        marginLeft: spacing.sm,
    },
    deliverToText: {
        ...typography.caption,
        color: colors.primary.zomato_red,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addressText: {
        ...typography.h3, // Make Address Large like iOS
        color: colors.secondary.gray_900,
        marginRight: 4,
        fontSize: 16,
    },
    profileButton: {
        marginLeft: spacing.md,
    },
    profileCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileInitial: {
        ...typography.h3,
        color: colors.secondary.gray_800,
        fontSize: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary.white,
        ...shadows.sm, // iOS style shadow
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: borderRadius.lg,
        height: 48,
        paddingHorizontal: spacing.md,
        width: '100%',
        marginTop: 4,
    },
    searchText: {
        ...typography.body_medium,
        color: colors.secondary.gray_500,
        marginLeft: spacing.sm,
        flex: 1,
    },
    micBorder: {
        width: 1,
        height: 20,
        backgroundColor: colors.secondary.gray_300,
        marginHorizontal: spacing.sm
    },
    // Sections
    promoContainer: {
        marginTop: spacing.md,
        marginBottom: spacing.lg,
    },
    promoCard: {
        width: width * 0.8,
        height: 140,
        marginRight: spacing.md,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        backgroundColor: colors.secondary.gray_100,
        position: 'relative',
    },
    promoImage: {
        width: '100%',
        height: '100%',
    },
    promoOverlay: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    promoText: {
        ...typography.label_small,
        fontWeight: 'bold',
    },
    categoryContainer: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.h4,
        color: colors.secondary.gray_900,
        marginLeft: spacing.md,
        marginBottom: spacing.md,
        letterSpacing: 0.5,
    },
    categoryItem: {
        alignItems: 'center',
        marginRight: spacing.lg,
        width: 70,
    },
    categoryImageContainer: {
        width: 60,
        height: 60,
        borderRadius: 30, // Circle
        backgroundColor: '#f8f8f8',
        marginBottom: spacing.xs,
        overflow: 'hidden',
    },
    categoryImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    categoryName: {
        ...typography.caption,
        color: colors.secondary.gray_800,
        textAlign: 'center',
    },
    sectionStart: {
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
    },
    listTitle: {
        ...typography.h3,
        color: colors.secondary.gray_900,
    },
    filterBar: {
        flexDirection: 'row',
        paddingHorizontal: spacing.md,
        marginBottom: spacing.lg,
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.secondary.gray_300,
        marginRight: spacing.sm,
        gap: 4,
        backgroundColor: colors.secondary.white,
    },
    filterText: {
        ...typography.caption,
        fontWeight: '600',
        color: colors.secondary.gray_800,
    }
});

export default HomeScreen;
