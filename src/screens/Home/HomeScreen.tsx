import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGetRestaurantsQuery } from '../../services/api/restaurantsApi';
import { RestaurantCard } from '@zomato/ui';
import { colors } from '@zomato/design-tokens';
import { Search, MapPin } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

export const HomeScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    // Use real data hook
    const { data: restaurants, isLoading, isError, refetch } = useGetRestaurantsQuery({});

    const handleRestaurantPress = (id: string) => {
        navigation.navigate('RestaurantDetail', { id });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.locationContainer}>
                    <MapPin size={20} color={colors.primary.zomato_red} />
                    <View>
                        <Text style={styles.locationLabel}>Delivering to</Text>
                        <Text style={styles.locationText}>Home - Gurgaon</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.profileButton}>
                    {/* User Avatar or Initials */}
                    <View style={styles.avatar} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
                <Search size={20} color="#888" />
                <Text style={styles.placeholder}>Restaurant name, cuisine, or a dish...</Text>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.primary.zomato_red} />}
            >
                <Text style={styles.sectionTitle}>Recommended for you</Text>

                {isError && (
                    <View style={styles.errorContainer}>
                        <Text>Failed to load restaurants.</Text>
                        <TouchableOpacity onPress={refetch}><Text style={{ color: colors.primary.zomato_red }}>Retry</Text></TouchableOpacity>
                    </View>
                )}

                {/* Categories / Filters could go here */}

                <View style={styles.restaurantList}>
                    {restaurants?.map((restaurant) => (
                        <RestaurantCard
                            key={restaurant.id}
                            restaurant={restaurant}
                            onPress={() => handleRestaurantPress(restaurant.id)}
                        />
                    ))}
                    {!isLoading && restaurants?.length === 0 && (
                        <Text style={styles.emptyText}>No restaurants found nearby.</Text>
                    )}
                </View>

                {isLoading && !restaurants && (
                    <View style={styles.loadingContainer}>
                        <Text>Loading tasty options...</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    locationLabel: {
        fontSize: 12,
        color: '#888',
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    locationText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1C1C1C',
    },
    profileButton: {
        padding: 4,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E0E0E0',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F4F4F4',
        marginHorizontal: 16,
        padding: 12,
        borderRadius: 12,
        gap: 10,
        marginBottom: 16,
    },
    placeholder: {
        color: '#888',
        fontSize: 15,
    },
    content: {
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1C1C1C',
        marginLeft: 16,
        marginBottom: 16,
    },
    restaurantList: {
        paddingHorizontal: 16,
        gap: 24,
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 20,
    },
    errorContainer: {
        alignItems: 'center',
        padding: 20,
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center'
    }
});
