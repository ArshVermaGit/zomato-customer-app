import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Heart, Clock, Star } from 'lucide-react-native';
import OptimizedImage from '../Common/OptimizedImage';

interface RestaurantProps {
    id: string;
    name: string;
    image: string;
    rating: number;
    cuisine: string;
    deliveryTime: string;
    priceForTwo: string;
    offer?: string;
}

const RestaurantCard = ({ restaurant }: { restaurant: RestaurantProps }) => {
    const navigation = useNavigation<any>();

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('RestaurantDetail', { id: restaurant.id })}
        >
            <View style={styles.imageContainer}>
                <OptimizedImage
                    source={{ uri: restaurant.image }}
                    style={styles.image}
                    resizeMode="cover"
                />

                {/* Offer Badge */}
                {restaurant.offer && (
                    <View style={styles.offerBadge}>
                        <Text style={styles.offerText}>{restaurant.offer}</Text>
                    </View>
                )}

                {/* Favorite Button */}
                <TouchableOpacity style={styles.favButton}>
                    <Heart color="#fff" size={20} />
                </TouchableOpacity>

                {/* Delivery Time Badge */}
                <View style={styles.timeBadge}>
                    <Clock color="#000" size={12} />
                    <Text style={styles.timeText}>{restaurant.deliveryTime}</Text>
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.row}>
                    <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
                    <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>{restaurant.rating}</Text>
                        <Star color="#fff" size={10} fill="#fff" />
                    </View>
                </View>

                <View style={styles.row}>
                    <Text style={styles.cuisine} numberOfLines={1}>{restaurant.cuisine}</Text>
                    <Text style={styles.price}>{restaurant.priceForTwo}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.footer}>
                    <Image
                        source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6124/6124998.png' }}
                        style={{ width: 16, height: 16, marginRight: 5 }}
                    />
                    <Text style={styles.footerText}>Max Safety Delivery available</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginHorizontal: 15,
        marginBottom: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: 'hidden',
    },
    imageContainer: {
        height: 200,
        backgroundColor: '#eee',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    offerBadge: {
        position: 'absolute',
        top: 20,
        left: 0,
        backgroundColor: '#256FEF',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    },
    offerText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    favButton: {
        position: 'absolute',
        top: 15,
        right: 15,
    },
    timeBadge: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 5,
    },
    timeText: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    content: {
        padding: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    ratingBadge: {
        backgroundColor: '#24963F',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 5,
    },
    ratingText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 2,
    },
    cuisine: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    price: {
        fontSize: 14,
        color: '#666',
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 10,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: '#999',
    },
});

export default React.memo(RestaurantCard);
