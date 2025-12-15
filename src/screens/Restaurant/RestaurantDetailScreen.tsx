import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, Platform, ScrollView, Animated as RNAnimated, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import type { RootState } from '../../store/store';
import { RestaurantService } from '../../services/restaurant.service';
import DishDetailModal from '../../components/Restaurant/DishDetailModal';
import { ChevronLeft, Share2, Search, Heart, Star, Clock } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius, shadows } from '@zomato/design-tokens';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    Extrapolate,
    useAnimatedScrollHandler
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

// Sub Components
import MenuTab from '../../components/Restaurant/MenuTab';
import { InfoTab, ReviewsTab } from '../../components/Restaurant/InfoReviewsTabs';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 200;

const RestaurantDetailScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { id } = route.params || { id: '1' };

    // Data & Redux
    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    // State
    const [restaurant, setRestaurant] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'menu' | 'info' | 'reviews'>('menu');
    const [selectedDish, setSelectedDish] = useState<any>(null);

    // Animation
    const scrollY = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler(event => {
        scrollY.value = event.contentOffset.y;
    });

    useEffect(() => {
        fetchRestaurant();
    }, []);

    const fetchRestaurant = async () => {
        const data = await RestaurantService.getRestaurantDetails(id);
        setRestaurant(data);
    };

    const handleDishSelect = (dish: any) => {
        if (dish.customizable) {
            setSelectedDish(dish);
        } else {
            // Add directly
            dispatch(addToCart({
                item: { ...dish, quantity: 1, finalPrice: dish.price },
                restaurant: {
                    id: restaurant.id,
                    name: restaurant.name,
                    image: restaurant.image,
                    location: restaurant.address
                }
            }));
        }
    };

    const handleModalAdd = (item: any) => {
        dispatch(addToCart({
            item: item,
            restaurant: {
                id: restaurant.id,
                name: restaurant.name,
                image: restaurant.image,
                location: restaurant.address
            }
        }));
    };

    // Parallax Styles
    const headerStyle = useAnimatedStyle(() => {
        return {
            height: HEADER_HEIGHT,
            transform: [
                {
                    translateY: interpolate(
                        scrollY.value,
                        [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
                        [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
                        Extrapolate.CLAMP
                    ),
                },
                {
                    scale: interpolate(
                        scrollY.value,
                        [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
                        [2, 1, 1],
                        Extrapolate.CLAMP
                    ),
                },
            ],
        };
    });

    if (!restaurant) return <View style={styles.loading}><Text>Loading...</Text></View>;

    return (
        <View style={styles.container}>
            <Animated.ScrollView
                style={styles.scrollView}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                stickyHeaderIndices={[2]} // The Tab Bar Section
                showsVerticalScrollIndicator={false}
            >
                {/* 0: Header Image with Parallax */}
                <View style={styles.headerContainer}>
                    <Animated.View style={[styles.imageContainer, headerStyle]}>
                        <Image source={{ uri: restaurant.image }} style={styles.image} resizeMode="cover" />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.7)']}
                            style={styles.gradient}
                        />
                    </Animated.View>

                    {/* Fixed Icons on top of Header */}
                    <View style={styles.headerIcons}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                            <ChevronLeft color="white" size={24} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity style={styles.iconBtn}>
                                <Search color="white" size={24} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn}>
                                <Share2 color="white" size={24} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn}>
                                <Heart color="white" size={24} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* 1: Info Card Overlay */}
                <View style={styles.infoCard}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.name}>{restaurant.name}</Text>
                        <View style={styles.ratingBox}>
                            <Text style={styles.ratingText}>{restaurant.rating}</Text>
                            <Star size={10} color="white" fill="white" style={{ marginLeft: 2 }} />
                        </View>
                    </View>

                    <Text style={styles.cuisines}>{restaurant.cuisines?.join(', ')}</Text>
                    <Text style={styles.location}>{restaurant.address} • {restaurant.distance}</Text>

                    <View style={styles.divider} />

                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}>
                            <Clock size={14} color={colors.secondary.gray_600} />
                            <Text style={styles.metaText}>{restaurant.deliveryTime} | {restaurant.distance}</Text>
                        </View>
                        {restaurant.offers && (
                            <Text style={styles.offerText}>{restaurant.offers}</Text>
                        )}
                    </View>
                </View>

                {/* 2: Sticky Tabs Header */}
                <View style={styles.stickyTabs}>
                    <View style={styles.tabsContainer}>
                        {['Menu', 'Reviews', 'Info'].map((tab) => {
                            const key = tab.toLowerCase() as any;
                            const isActive = activeTab === key;
                            return (
                                <TouchableOpacity
                                    key={key}
                                    onPress={() => setActiveTab(key)}
                                    style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                                >
                                    <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
                                    {isActive && <View style={styles.activeLine} />}
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </View>

                {/* 3: Content Body */}
                <View style={[styles.contentBody, { minHeight: 500 }]}>
                    {activeTab === 'menu' && (
                        <MenuTab menu={restaurant.menu || []} onAddToCart={handleDishSelect} />
                    )}
                    {activeTab === 'info' && <InfoTab restaurant={restaurant} />}
                    {activeTab === 'reviews' && <ReviewsTab />}
                </View>

            </Animated.ScrollView>

            {/* Floating Cart Button */}
            {cartCount > 0 && (
                <View style={styles.floatingCartContainer}>
                    <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Cart')}>
                        <View>
                            <Text style={styles.cartItemsText}>{cartCount} ITEMS</Text>
                            <Text style={styles.cartSubText}>plus taxes</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.viewCartText}>View Cart</Text>
                            <View style={styles.triangle} />
                        </View>
                    </TouchableOpacity>
                </View>
            )}

            <DishDetailModal
                visible={!!selectedDish}
                dish={selectedDish}
                onClose={() => setSelectedDish(null)}
                onAddToCart={handleModalAdd}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.white,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scrollView: {
        flex: 1,
    },
    headerContainer: {
        height: HEADER_HEIGHT,
        width: '100%',
        overflow: 'hidden',
    },
    imageContainer: {
        height: HEADER_HEIGHT,
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
    },
    headerIcons: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 44 : 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        zIndex: 10,
    },
    iconBtn: {
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: borderRadius.full,
    },
    infoCard: {
        padding: spacing.md,
        backgroundColor: colors.secondary.white,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        marginTop: -20, // Overlap the header slightly
        ...shadows.sm,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    name: {
        ...typography.h3,
        color: colors.secondary.gray_900,
        flex: 1,
        marginRight: 10,
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#24963F',
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 6,
    },
    ratingText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    cuisines: {
        ...typography.body_medium,
        color: colors.secondary.gray_600,
        marginTop: 4,
    },
    location: {
        ...typography.body_small,
        color: colors.secondary.gray_500,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: colors.secondary.gray_100,
        marginVertical: spacing.md,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        ...typography.caption,
        fontWeight: 'bold',
        color: colors.secondary.gray_800,
    },
    offerText: {
        ...typography.caption,
        color: '#256FEF',
        fontWeight: '700',
    },
    stickyTabs: {
        backgroundColor: colors.secondary.white,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        paddingVertical: 0,
    },
    tabsContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.gray_100,
    },
    tabBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 14,
        position: 'relative',
    },
    tabBtnActive: {
        // active state
    },
    tabText: {
        ...typography.body_large,
        color: colors.secondary.gray_600,
        fontWeight: '600',
    },
    tabTextActive: {
        color: colors.primary.zomato_red,
    },
    activeLine: {
        position: 'absolute',
        bottom: 0,
        height: 3,
        width: '100%',
        backgroundColor: colors.primary.zomato_red,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
    },
    contentBody: {
        backgroundColor: colors.secondary.white,
    },
    floatingCartContainer: {
        position: 'absolute',
        bottom: 20,
        left: spacing.md,
        right: spacing.md,
        elevation: 10,
        zIndex: 100,
    },
    cartButton: {
        backgroundColor: colors.primary.zomato_red,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...shadows.lg,
    },
    cartItemsText: {
        ...typography.label_medium,
        color: 'white',
        textTransform: 'uppercase',
    },
    cartSubText: {
        ...typography.caption,
        color: 'rgba(255,255,255,0.9)',
    },
    viewCartText: {
        ...typography.body_large,
        color: 'white',
        fontWeight: '700',
        marginRight: 8,
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderBottomWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'white',
        transform: [{ rotate: '90deg' }],
    },
});

export default RestaurantDetailScreen;
