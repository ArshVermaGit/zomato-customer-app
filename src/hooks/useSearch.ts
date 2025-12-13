import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_SEARCH_KEY = 'recentSearches';

export const useSearch = () => {
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [trendingSearches] = useState(['Biryani', 'Pizza', 'Cake', 'Rolls', 'Burger']); // Mock
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        loadRecentSearches();
    }, []);

    const loadRecentSearches = async () => {
        try {
            const stored = await AsyncStorage.getItem(RECENT_SEARCH_KEY);
            if (stored) {
                setRecentSearches(JSON.parse(stored));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const addRecentSearch = async (term: string) => {
        if (!term.trim()) return;
        try {
            const newHistory = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5); // Keep top 5
            setRecentSearches(newHistory);
            await AsyncStorage.setItem(RECENT_SEARCH_KEY, JSON.stringify(newHistory));
        } catch (e) {
            console.error(e);
        }
    };

    const clearRecentSearches = async () => {
        setRecentSearches([]);
        await AsyncStorage.removeItem(RECENT_SEARCH_KEY);
    };

    const fetchSuggestions = async (query: string) => {
        // Mock API call
        if (!query) {
            setSuggestions([]);
            return;
        }
        await new Promise(resolve => setTimeout(resolve, 200));
        setSuggestions([
            `${query} in Restaurant`,
            `${query} delivery`,
            `${query} nearby`,
            `Best ${query}`
        ]);
    };

    return {
        recentSearches,
        trendingSearches,
        suggestions,
        addRecentSearch,
        clearRecentSearches,
        fetchSuggestions
    };
};
