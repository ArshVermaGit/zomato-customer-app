import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, Mic, X, ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import debounce from 'lodash.debounce';

interface SearchBarProps {
    value?: string;
    onSearchChange?: (text: string) => void;
    onVoicePress?: () => void;
    autoFocus?: boolean;
    editable?: boolean;
    onPress?: () => void;
}

const SearchBar = ({
    value = '',
    onSearchChange,
    onVoicePress,
    autoFocus = false,
    editable = true,
    onPress
}: SearchBarProps) => {
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState(value);

    // Debounce the callback
    const debouncedSearch = debounce((text: string) => {
        if (onSearchChange) onSearchChange(text);
    }, 300);

    const handleChange = (text: string) => {
        setSearchText(text);
        debouncedSearch(text);
    };

    const handleClear = () => {
        setSearchText('');
        if (onSearchChange) onSearchChange('');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <ChevronLeft color="#333" size={28} />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.searchContainer}
                onPress={onPress}
                activeOpacity={editable ? 1 : 0.7}
            >
                <Search color="#E23744" size={20} />
                <TextInput
                    style={styles.input}
                    placeholder="Restaurant name or dish..."
                    value={searchText}
                    onChangeText={handleChange}
                    autoFocus={autoFocus}
                    editable={editable}
                    placeholderTextColor="#999"
                />

                {searchText.length > 0 ? (
                    <TouchableOpacity onPress={handleClear}>
                        <X color="#666" size={18} />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={onVoicePress}>
                        <Mic color="#E23744" size={20} />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    backButton: {
        marginRight: 10,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 45,
        borderWidth: 1,
        borderColor: '#e8e8e8',
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
});

export default SearchBar;
