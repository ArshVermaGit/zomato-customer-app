/**
 * LocationSearchBar Component
 * Search input with autocomplete suggestions for address search
 */

import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { Search, X, MapPin } from 'lucide-react-native';
import debounce from 'lodash.debounce';
import { AddressService } from '../../services/address.service';
import type { LocationSuggestion } from '../../types/address.types';

interface LocationSearchBarProps {
    placeholder?: string;
    onSelectLocation: (suggestion: LocationSuggestion) => void;
    onClear?: () => void;
}

const LocationSearchBar: React.FC<LocationSearchBarProps> = ({
    placeholder = 'Search for area, street name...',
    onSelectLocation,
    onClear,
}) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const searchLocations = useCallback(
        debounce(async (searchQuery: string) => {
            if (searchQuery.length < 2) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            setIsLoading(true);
            try {
                const results = await AddressService.searchLocations(searchQuery);
                setSuggestions(results);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Error searching locations:', error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        }, 300),
        []
    );

    const handleChangeText = (text: string) => {
        setQuery(text);
        searchLocations(text);
    };

    const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
        setQuery(suggestion.mainText);
        setShowSuggestions(false);
        setSuggestions([]);
        onSelectLocation(suggestion);
    };

    const handleClear = () => {
        setQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
        onClear?.();
    };

    const renderSuggestion = ({ item }: { item: LocationSuggestion }) => (
        <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => handleSelectSuggestion(item)}
        >
            <MapPin size={18} color="#666" style={styles.suggestionIcon} />
            <View style={styles.suggestionText}>
                <Text style={styles.mainText}>{item.mainText}</Text>
                <Text style={styles.secondaryText}>{item.secondaryText}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Search size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#999"
                    value={query}
                    onChangeText={handleChangeText}
                    returnKeyType="search"
                    autoCorrect={false}
                />
                {isLoading ? (
                    <ActivityIndicator size="small" color="#E23744" style={styles.loader} />
                ) : query.length > 0 ? (
                    <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                        <X size={18} color="#666" />
                    </TouchableOpacity>
                ) : null}
            </View>

            {showSuggestions && suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                    <FlatList
                        data={suggestions}
                        renderItem={renderSuggestion}
                        keyExtractor={(item) => item.placeId}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        zIndex: 1000,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    searchIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#333',
        padding: 0,
    },
    loader: {
        marginLeft: 10,
    },
    clearButton: {
        marginLeft: 10,
        padding: 4,
    },
    suggestionsContainer: {
        position: 'absolute',
        top: 56,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        maxHeight: 250,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    suggestionIcon: {
        marginRight: 12,
    },
    suggestionText: {
        flex: 1,
    },
    mainText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    secondaryText: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
});

export default LocationSearchBar;
