import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SlidersHorizontal, ChevronDown, Check } from 'lucide-react-native';
import SearchBar from '../../components/Search/SearchBar';
import { RestaurantCard } from '@zomato/ui'; // Use shared component
import { HomeService } from '../../services/home.service';
import { EmptyState } from '@zomato/ui';
import { colors, spacing, typography, borderRadius } from '@zomato/design-tokens';
import Animated, { FadeInRight } from 'react-native-reanimated';

const FILTERS = [
    { id: 'sort', label: 'Sort' },
    { id: 'near', label: 'Nearest' },
    { id: 'rating', label: 'Rating 4.0+' },
    { id: 'pure_veg', label: 'Pure Veg' },
    { id: 'offers', label: 'Great Offers' },
];

const SearchResultsScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { query } = route.params || {};

    const [searchText, setSearchText] = useState(query || '');
    const [results, setResults] = useState<any[]>([]);
    const [activeFilters, setActiveFilters] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, [searchText, activeFilters]);

    const fetchResults = async () => {
        setIsLoading(true);
        // Simulate delay & filtering
        setTimeout(async () => {
            const data = await HomeService.getNearbyRestaurants();
            // Mock filter logic
            let filtered = data;
            if (activeFilters.includes('rating')) {
                filtered = filtered.filter((r: any) => r.rating >= 4.0);
            }
            // Mock search logic
            if (searchText) {
                filtered = filtered.filter((r: any) =>
                    r.name.toLowerCase().includes(searchText.toLowerCase()) ||
                    r.cuisines.join('').toLowerCase().includes(searchText.toLowerCase())
                );
            }

            setResults(filtered);
            setIsLoading(false);
        }, 800);
    };

    const toggleFilter = (id: string) => {
        setActiveFilters(prev =>
            prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
        );
    };

    const renderFilter = ({ item, index }: { item: typeof FILTERS[0], index: number }) => {
        const isActive = activeFilters.includes(item.id);
        return (
            <Animated.View entering={FadeInRight.delay(index * 100)}>
                <TouchableOpacity
                    style={[
                        styles.filterChip,
                        isActive && styles.filterChipActive
                    ]}
                    onPress={() => toggleFilter(item.id)}
                >
                    {item.id === 'sort' && <SlidersHorizontal size={14} color={isActive ? colors.secondary.white : colors.secondary.gray_800} style={{ marginRight: 6 }} />}
                    <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                        {item.label}
                    </Text>
                    {isActive && <Check size={14} color={colors.secondary.white} style={{ marginLeft: 6 }} />}
                </TouchableOpacity>
            </Animated.View>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header: Fixed Search Bar */}
            <View style={styles.header}>
                <SearchBar
                    value={searchText}
                    onSearchChange={setSearchText} // Live search
                    editable={true}
                    onPress={() => navigation.goBack()}
                    placeholder="Search in results..."
                />
            </View>

            {/* Filter ScrollView */}
            <View style={styles.filterContainer}>
                <FlatList
                    horizontal
                    data={FILTERS}
                    keyExtractor={item => item.id}
                    renderItem={renderFilter}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: spacing.md, paddingVertical: spacing.sm }}
                />
            </View>

            {/* Results List */}
            {isLoading ? (
                // Skeleton Loader could go here
                <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                    <Text>Loading...</Text>
                </View>
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={{ paddingHorizontal: spacing.md }}>
                            <RestaurantCard
                                restaurant={item}
                                onPress={() => navigation.navigate('RestaurantDetail', { id: item.id })}
                            />
                        </View>
                    )}
                    ListEmptyComponent={
                        <EmptyState
                            variant="search"
                            title="No restaurants found"
                            description={`We couldn't find any results for "${searchText}".`}
                            ctaText="Clear Search"
                            onPressCta={() => setSearchText('')}
                            style={{ marginTop: 50 }}
                        />
                    }
                    contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.white,
    },
    header: {
        paddingTop: 50, // Safe Area
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.sm,
        backgroundColor: colors.secondary.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.gray_100,
    },
    filterContainer: {
        height: 50,
        backgroundColor: colors.secondary.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.gray_100,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.secondary.gray_300,
        marginRight: spacing.sm,
        backgroundColor: colors.secondary.white,
    },
    filterChipActive: {
        backgroundColor: colors.secondary.gray_800, // Active dark mode style
        borderColor: colors.secondary.gray_800,
    },
    filterText: {
        ...typography.caption,
        fontWeight: '600',
        color: colors.secondary.gray_800,
    },
    filterTextActive: {
        color: colors.secondary.white,
    },
});

export default SearchResultsScreen;
