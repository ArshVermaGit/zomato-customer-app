import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Clock, TrendingUp, Search as SearchIcon } from 'lucide-react-native';
import SearchBar from '../../components/Search/SearchBar';
import VoiceSearchModal from '../../components/Search/VoiceSearchModal';
import { useSearch } from '../../hooks/useSearch';

const SearchScreen = () => {
    const navigation = useNavigation<any>();
    const [searchText, setSearchText] = useState('');
    const [isVoiceModalVisible, setIsVoiceModalVisible] = useState(false);
    const {
        recentSearches,
        trendingSearches,
        suggestions,
        addRecentSearch,
        clearRecentSearches,
        fetchSuggestions
    } = useSearch();

    const handleSearch = (text: string) => {
        setSearchText(text);
        fetchSuggestions(text);
    };

    const handleSubmit = (query: string) => {
        addRecentSearch(query);
        navigation.navigate('SearchResults', { query });
    };

    return (
        <View style={styles.container}>
            <SearchBar
                value={searchText}
                onSearchChange={handleSearch}
                onVoicePress={() => setIsVoiceModalVisible(true)}
                autoFocus
            />

            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>

                {/* Suggestions List */}
                {searchText.length > 0 && (
                    <View style={styles.section}>
                        {suggestions.map((item, index) => (
                            <TouchableOpacity key={index} style={styles.suggestionItem} onPress={() => handleSubmit(item)}>
                                <SearchIcon color="#999" size={18} />
                                <Text style={styles.suggestionText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Recent Searches */}
                {searchText.length === 0 && recentSearches.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recent Searches</Text>
                            <TouchableOpacity onPress={clearRecentSearches}>
                                <Text style={styles.clearText}>Clear</Text>
                            </TouchableOpacity>
                        </View>
                        {recentSearches.map((item, index) => (
                            <TouchableOpacity key={index} style={styles.recentItem} onPress={() => handleSubmit(item)}>
                                <Clock color="#999" size={18} />
                                <Text style={styles.recentText}>{item}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Trending Searches */}
                {searchText.length === 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Trending Searches</Text>
                        <View style={styles.trendingContainer}>
                            {trendingSearches.map((item, index) => (
                                <TouchableOpacity key={index} style={styles.trendingChip} onPress={() => handleSubmit(item)}>
                                    <TrendingUp color="#E23744" size={16} style={{ marginRight: 5 }} />
                                    <Text style={styles.trendingText}>{item}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>

            <VoiceSearchModal
                visible={isVoiceModalVisible}
                onClose={() => setIsVoiceModalVisible(false)}
                onResult={handleSubmit}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    clearText: {
        color: '#E23744',
        fontSize: 14,
        fontWeight: '600',
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    recentText: {
        marginLeft: 15,
        fontSize: 16,
        color: '#333',
    },
    trendingContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    trendingChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        marginBottom: 10,
    },
    trendingText: {
        color: '#E23744',
        fontWeight: '600',
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    suggestionText: {
        marginLeft: 15,
        fontSize: 16,
        color: '#333',
    },
});

export default SearchScreen;
