/**
 * Favorites Screen
 * List of favorite restaurants
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Clock, Trash2 } from 'lucide-react-native';
import { ChevronLeft } from 'lucide-react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { RootState, AppDispatch } from '../../store/store';
import { fetchFavorites, removeFavorite } from '../../store/slices/authSlice';
import { FavoriteRestaurant } from '../../types/user.types';
import FadeInView from '../../components/Animations/FadeInView';

const FavoritesScreen = () => {
    const navigation = useNavigation<any>();
    const dispatch = useDispatch<AppDispatch>();
    const { favorites, isLoading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(fetchFavorites());
    }, []);

    const handleRemove = (id: string) => {
        dispatch(removeFavorite(id));
    };

    const handlePress = (id: string) => {
        navigation.navigate('RestaurantDetail', { restaurantId: id });
    };

    const renderRightActions = (_progress: any, _dragX: any, id: string) => {
        return (
            <TouchableOpacity onPress={() => handleRemove(id)} style={styles.deleteAction}>
                <View style={styles.deleteIconContainer}>
                    <Trash2 color="#fff" size={24} />
                    <Text style={styles.deleteText}>Remove</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderItem = ({ item, index }: { item: FavoriteRestaurant; index: number }) => (
        <FadeInView delay={index * 100}>
            <Swipeable
                renderRightActions={(_p, _d) => renderRightActions(_p, _d, item.id)}
                rightThreshold={40}
            >
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => handlePress(item.id)}
                    activeOpacity={0.8}
                >
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <View style={styles.content}>
                        <View style={styles.row}>
                            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                            <View style={styles.ratingBadge}>
                                <Text style={styles.ratingText}>{item.rating}</Text>
                                <Star size={10} color="#fff" fill="#fff" />
                            </View>
                        </View>
                        <Text style={styles.cuisine} numberOfLines={1}>{item.cuisine}</Text>
                        <Text style={styles.address} numberOfLines={1}>{item.address}</Text>

                        <View style={styles.footer}>
                            <View style={styles.timeContainer}>
                                <Clock size={14} color="#666" />
                                <Text style={styles.timeText}>{item.deliveryTime}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        </FadeInView>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Favorites</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={favorites}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={() => dispatch(fetchFavorites())} colors={['#E23744']} />
                }
                ListEmptyComponent={() => (
                    <View style={styles.emptyState}>
                        <Star size={64} color="#E0E0E0" />
                        <Text style={styles.emptyTitle}>No Favorites Yet</Text>
                        <Text style={styles.emptySubtitle}>Mark restaurants as favorite to see them here.</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    listContent: {
        padding: 16,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    image: {
        width: 100,
        height: '100%',
        backgroundColor: '#F0F0F0',
    },
    content: {
        flex: 1,
        padding: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        marginRight: 8,
    },
    ratingBadge: {
        backgroundColor: '#2E7D32',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    ratingText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    cuisine: {
        fontSize: 13,
        color: '#666',
        marginBottom: 2,
    },
    address: {
        fontSize: 12,
        color: '#999',
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timeText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    deleteAction: {
        backgroundColor: '#E23744',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        marginBottom: 16,
        borderRadius: 12,
        marginRight: 8, // slight offset
        height: '100%',
    },
    deleteIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 4,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
    },
});

export default FavoritesScreen;
