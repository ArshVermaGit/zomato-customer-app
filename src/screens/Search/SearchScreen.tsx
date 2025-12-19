import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Clock, TrendingUp, Search as SearchIcon, ArrowUpLeft } from 'lucide-react-native';
import SearchBar from '../../components/Search/SearchBar';
import { useSearch } from '../../hooks/useSearch';
import { colors, spacing, typography, borderRadius } from '@zomato/design-tokens';
import { EmptyState } from '@zomato/ui';

const SearchScreen = () => {
    const navigation = useNavigation<any>();
    const [searchText, setSearchText] = useState('');
    const {
        recentSearches,
        trendingSearches,
        suggestions, // Simulated suggestions
        addRecentSearch,
        clearRecentSearches,
        fetchSuggestions
    } = useSearch();

    const handleSearch = (text: string) => {
        setSearchText(text);
        fetchSuggestions(text);
    };

    const handleSubmit = (query: string) => {
        if (!query.trim()) return;
        addRecentSearch(query);
        navigation.navigate('SearchResults', { query });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <SearchBar
                    value={searchText}
                    onSearchChange={handleSearch}
                    autoFocus
                    onPress={() => navigation.goBack()} // Fallback if needed
                    placeholder="Restaurant name, cuisine, or a dish..."
                />
            </View>

            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >

                {/* Suggestions List */}
                {searchText.length > 0 && (
                    <View style={styles.section}>
                        {suggestions.length > 0 ? (
                            suggestions.map((item, index) => (
                                <TouchableOpacity key={index} style={styles.suggestionItem} onPress={() => handleSubmit(item)}>
                                    <View style={styles.iconBox}>
                                        <SearchIcon color={colors.secondary.gray_600} size={18} />
                                    </View>
                                    <View style={styles.suggestionTextContainer}>
                                        <Text style={styles.suggestionText}>{item}</Text>
                                        <Text style={styles.suggestionType}>Dish</Text>
                                    </View>
                                    <ArrowUpLeft size={18} color={colors.secondary.gray_400} style={{ transform: [{ rotate: '45deg' }] }} />
                                </TouchableOpacity>
                            ))
                        ) : (
                            // Live Empty State if no suggestions match
                            <EmptyState
                                title="No matching results"
                                description="Try a different keyword"
                                variant="search"
                                style={{ marginTop: 20 }}
                            />
                        )}
                    </View>
                )}

                {/* Default State: Recent & Trending */}
                {searchText.length === 0 && (
                    <>
                        {/* Recent Searches */}
                        {recentSearches.length > 0 && (
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                                    <TouchableOpacity onPress={clearRecentSearches}>
                                        <Text style={styles.clearText}>Clear All</Text>
                                    </TouchableOpacity>
                                </View>
                                {recentSearches.map((item, index) => (
                                    <TouchableOpacity key={index} style={styles.recentItem} onPress={() => handleSubmit(item)}>
                                        <Clock color={colors.secondary.gray_500} size={18} />
                                        <Text style={styles.recentText}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* Trending Searches */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Trending Near You</Text>
                            <View style={styles.trendingContainer}>
                                {trendingSearches.map((item, index) => (
                                    <TouchableOpacity key={index} style={styles.trendingChip} onPress={() => handleSubmit(item)}>
                                        <TrendingUp color={colors.primary.zomato_red} size={16} />
                                        <Text style={styles.trendingText}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.white,
    },
    header: {
        paddingHorizontal: spacing.md,
        paddingTop: 50, // Safe Area approx
        paddingBottom: spacing.xs,
        backgroundColor: colors.secondary.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.gray_100,
    },
    content: {
        padding: spacing.md,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        ...typography.h4,
        color: colors.secondary.gray_900,
        letterSpacing: 0.5,
    },
    clearText: {
        ...typography.caption,
        color: colors.primary.zomato_red,
        fontWeight: '600',
    },
    recentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.gray_50,
        gap: spacing.md,
    },
    recentText: {
        ...typography.body_large,
        color: colors.secondary.gray_800,
    },
    trendingContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: spacing.sm,
        gap: spacing.sm,
    },
    trendingChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary.white,
        borderWidth: 1,
        borderColor: colors.secondary.gray_200,
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.md,
        paddingVertical: 8,
        gap: 6,
        // Chip shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    trendingText: {
        ...typography.body_medium,
        color: colors.secondary.gray_800,
        fontWeight: '500',
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.gray_100,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.secondary.gray_100,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    suggestionTextContainer: {
        flex: 1,
    },
    suggestionText: {
        ...typography.body_large,
        color: colors.secondary.gray_900,
    },
    suggestionType: {
        ...typography.caption,
        color: colors.secondary.gray_500,
    },
});

export default SearchScreen;
