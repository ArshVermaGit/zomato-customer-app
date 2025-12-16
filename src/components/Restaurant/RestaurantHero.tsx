import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { ChevronLeft, Share2, Heart, Star, Clock } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

interface RestaurantHeroProps {
    restaurant: any;
}

const RestaurantHero = ({ restaurant }: RestaurantHeroProps) => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Animated.Image
                    source={{ uri: restaurant.image }}
                    style={styles.image}
                    resizeMode="cover"
                    // @ts-ignore
                    sharedTransitionTag={`restaurant-${restaurant.id}`}
                />
                <View style={styles.overlay} />

                <View style={styles.headerButtons}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                        <ChevronLeft color="#fff" size={28} />
                    </TouchableOpacity>
                    <View style={styles.rightIcons}>
                        <TouchableOpacity style={styles.iconButton}>
                            <Share2 color="#fff" size={24} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <Heart color="#fff" size={24} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={styles.infoCard}>
                <View style={styles.titleRow}>
                    <Text style={styles.name}>{restaurant.name}</Text>
                    <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>{restaurant.rating}</Text>
                        <Star color="#fff" size={12} fill="#fff" />
                    </View>
                </View>

                <Text style={styles.cuisine}>{restaurant.cuisine}</Text>
                <Text style={styles.location}>{restaurant.location}</Text>

                <View style={styles.divider} />

                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Clock color="#666" size={16} />
                        <Text style={styles.statText}>{restaurant.deliveryTime}</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statText}>{restaurant.priceForTwo}</Text>
                    </View>
                </View>

                {restaurant.offer && (
                    <View style={styles.offerContainer}>
                        <Image
                            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/726/726476.png' }}
                            style={{ width: 16, height: 16, marginRight: 5 }}
                        />
                        <Text style={styles.offerText}>{restaurant.offer}</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingBottom: 20,
    },
    imageContainer: {
        height: 250,
        width: width,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    headerButtons: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    rightIcons: {
        flexDirection: 'row',
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    infoCard: {
        backgroundColor: '#fff',
        marginTop: -30,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    ratingBadge: {
        backgroundColor: '#24963F',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    ratingText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        marginRight: 4,
    },
    cuisine: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    location: {
        fontSize: 14,
        color: '#999',
        marginBottom: 15,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginBottom: 15,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    statText: {
        marginLeft: 5,
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    offerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        backgroundColor: '#E5F3F3',
        padding: 10,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    offerText: {
        color: '#2D8182',
        fontWeight: 'bold',
        fontSize: 12,
    },
});

export default RestaurantHero;
