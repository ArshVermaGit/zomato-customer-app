import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text } from 'react-native';
import HomeHeader from '../../components/Home/HomeHeader';
import PromoCarousel from '../../components/Home/PromoCarousel';
import CategoryRail from '../../components/Home/CategoryRail';
import RestaurantCard from '../../components/Home/RestaurantCard';
import { HomeService } from '../../services/home.service';

const HomeScreen = () => {
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await HomeService.getNearbyRestaurants();
            setRestaurants(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderHeader = () => (
        <View>
            <PromoCarousel />
            <CategoryRail />
            <Text style={styles.sectionTitle}>{restaurants.length} restaurants around you</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <HomeHeader />
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#E23744" />
                </View>
            ) : (
                <FlatList
                    data={restaurants}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <RestaurantCard restaurant={item} />}
                    ListHeaderComponent={renderHeader}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    showsVerticalScrollIndicator={false}
                    refreshing={loading}
                    onRefresh={fetchData}
                    // Optimization Props
                    initialNumToRender={5}
                    maxToRenderPerBatch={5}
                    windowSize={5}
                    removeClippedSubviews={true}
                    getItemLayout={(data, index) => ({
                        length: 280, // Approx height of card + margin
                        offset: 280 * index,
                        index,
                    })}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 15,
        marginTop: 10,
        marginBottom: 15,
        color: '#333',
    },
});

export default HomeScreen;
