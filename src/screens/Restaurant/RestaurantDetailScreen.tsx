import React, { useEffect, useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Text, TouchableOpacity } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import type { RootState } from '../../store/store';
import RestaurantHero from '../../components/Restaurant/RestaurantHero';
import MenuTab from '../../components/Restaurant/MenuTab';
import { InfoTab, ReviewsTab } from '../../components/Restaurant/InfoReviewsTabs';
import { RestaurantService } from '../../services/restaurant.service';
import DishDetailModal from '../../components/Restaurant/DishDetailModal';

const RestaurantDetailScreen = () => {
    const layout = useWindowDimensions();
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { id } = route.params || { id: '1' };

    const dispatch = useDispatch();
    const cartItems = useSelector((state: RootState) => state.cart.items);
    const cartRestaurant = useSelector((state: RootState) => state.cart.restaurant);

    // Calculate total count from Redux
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const [restaurant, setRestaurant] = useState<any>(null);
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'menu', title: 'Menu' },
        { key: 'info', title: 'Info' },
        { key: 'reviews', title: 'Reviews' },
    ]);
    const [selectedDish, setSelectedDish] = useState<any>(null);

    useEffect(() => {
        fetchRestaurant();
    }, []);

    const fetchRestaurant = async () => {
        const data = await RestaurantService.getRestaurantDetails(id);
        setRestaurant(data);
    };

    const addItemToCart = (dish: any) => {
        dispatch(addToCart({
            item: {
                id: dish.id,
                name: dish.name,
                price: dish.price,
                finalPrice: dish.finalPrice || dish.price, // DishDetailModal passes finalPrice
                quantity: dish.quantity || 1,
                isVeg: dish.isVeg,
                selections: dish.selections, // From Modal
                specialRequest: dish.specialRequest // From Modal
            },
            restaurant: {
                id: restaurant.id,
                name: restaurant.name,
                image: restaurant.image,
                location: restaurant.address // Assuming address property exists
            }
        }));
    };

    // Called when a dish is clicked from the MenuTab
    const handleDishSelect = (dish: any) => {
        if (dish.customizable) {
            setSelectedDish(dish);
        } else {
            addItemToCart(dish);
        }
    };

    // Called when "Add" is clicked inside the Modal
    const handleModalAdd = (item: any) => {
        addItemToCart(item);
    };

    const renderScene = ({ route }: any) => {
        switch (route.key) {
            case 'menu':
                // Pass handleDishSelect instead of direct addToCart
                return <MenuTab menu={restaurant?.menu || []} onAddToCart={handleDishSelect} />;
            case 'info':
                return <InfoTab restaurant={restaurant} />;
            case 'reviews':
                return <ReviewsTab />;
            default:
                return null;
        }
    };

    if (!restaurant) return null;

    return (
        <View style={styles.container}>
            <RestaurantHero restaurant={restaurant} />

            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={props => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: '#E23744', height: 3 }}
                        style={{ backgroundColor: 'white' }}
                        activeColor="#E23744"
                        inactiveColor="#999"
                        renderLabel={({ route, focused }) => (
                            <Text style={{
                                color: focused ? '#E23744' : '#666',
                                fontWeight: 'bold'
                            }}>
                                {route.title}
                            </Text>
                        )}
                    />
                )}
            />

            {cartCount > 0 && (
                <View style={styles.floatingCart}>
                    <View>
                        <Text style={styles.cartItems}>{cartCount} ITEMS</Text>
                        <Text style={styles.cartSubtext}>plus taxes</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.viewCartBtn}
                        onPress={() => navigation.navigate('Cart')}
                    >
                        <Text style={styles.viewCartText}>View Cart</Text>
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
        backgroundColor: '#fff',
    },
    floatingCart: {
        position: 'absolute',
        bottom: 20,
        left: 15,
        right: 15,
        backgroundColor: '#E23744',
        borderRadius: 10,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 5,
    },
    cartItems: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    cartSubtext: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 10,
    },
    viewCartBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    viewCartText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default RestaurantDetailScreen;
