import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SlidersHorizontal } from 'lucide-react-native';
import SearchBar from '../../components/Search/SearchBar';
import RestaurantCard from '../../components/Home/RestaurantCard';
import FilterModal from '../../components/Search/FilterModal';
import { HomeService } from '../../services/home.service';

const SearchResultsScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { query } = route.params || {};

    const [searchText, setSearchText] = useState(query || '');
    const [results, setResults] = useState<any[]>([]);
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState({});

    useEffect(() => {
        // Retrieve mock data and filter if we had a real backend
        fetchResults();
    }, [searchText, appliedFilters]);

    const fetchResults = async () => {
        // Reusing HomeService mock for now
        const data = await HomeService.getNearbyRestaurants();
        setResults(data); // In real app, we would pass query to API
    };

    const handleApplyFilters = (filters: any) => {
        setAppliedFilters(filters);
        setIsFilterVisible(false);
        // Trigger refetch with new filters
    };

    return (
        <View style={styles.container}>
            {/* Header with Search and Filter Button */}
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <SearchBar
                        value={searchText}
                        onSearchChange={setSearchText}
                        editable={false} // Go back to search screen to edit
                        onPress={() => navigation.goBack()}
                    />
                </View>
                <TouchableOpacity style={styles.filterButton} onPress={() => setIsFilterVisible(true)}>
                    <SlidersHorizontal color="#333" size={20} />
                </TouchableOpacity>
            </View>

            {/* Results List */}
            <FlatList
                data={results}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <RestaurantCard restaurant={item} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text>No results found for "{searchText}"</Text>
                    </View>
                }
                contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
            />

            <FilterModal
                visible={isFilterVisible}
                onClose={() => setIsFilterVisible(false)}
                onApply={handleApplyFilters}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    filterButton: {
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginLeft: 5,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
});

export default SearchResultsScreen;
