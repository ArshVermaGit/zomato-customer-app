import React, { useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Animated, Keyboard } from 'react-native';
import { Search, X, Mic } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '@zomato/design-tokens';

interface SearchBarProps {
    value: string;
    onSearchChange: (text: string) => void;
    onVoicePress?: () => void;
    autoFocus?: boolean;
    editable?: boolean;
    onPress?: () => void;
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onSearchChange,
    onVoicePress,
    autoFocus = false,
    editable = true,
    onPress,
    placeholder = "Restaurant name, cuisine, or a dish..."
}) => {
    const inputRef = useRef<TextInput>(null);
    const cancelWidth = useRef(new Animated.Value(0)).current;
    const [isFocused, setIsFocused] = React.useState(false);

    useEffect(() => {
        if (autoFocus) {
            // Short delay to allow screen transition
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [autoFocus]);

    useEffect(() => {
        Animated.timing(cancelWidth, {
            toValue: isFocused || value.length > 0 ? 60 : 0,
            duration: 250,
            useNativeDriver: false,
        }).start();
    }, [isFocused, value]);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        if (value.length === 0) {
            setIsFocused(false);
        }
    };

    const handleCancel = () => {
        Keyboard.dismiss();
        onSearchChange('');
        setIsFocused(false);
        inputRef.current?.blur();
        if (onPress && !editable) onPress(); // Navigate back behavior if not editable
    };

    const handleClear = () => {
        onSearchChange('');
        inputRef.current?.focus();
    };

    if (!editable) {
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.container}>
                <View style={styles.inputContainer}>
                    <Search size={20} color={colors.primary.zomato_red} style={styles.icon} />
                    <Text style={[styles.input, { color: colors.secondary.gray_500, lineHeight: 40 }]}>
                        {value || placeholder}
                    </Text>
                    <Mic size={20} color={colors.primary.zomato_red} style={{ marginRight: 10 }} />
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Search size={20} color={colors.primary.zomato_red} style={styles.icon} />
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    value={value}
                    onChangeText={onSearchChange}
                    placeholder={placeholder}
                    placeholderTextColor={colors.secondary.gray_500}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    returnKeyType="search"
                />
                {value.length > 0 ? (
                    <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                        <X size={14} color={colors.secondary.white} />
                    </TouchableOpacity>
                ) : (
                    onVoicePress && (
                        <TouchableOpacity onPress={onVoicePress}>
                            <Mic size={20} color={colors.primary.zomato_red} style={{ marginRight: 8 }} />
                        </TouchableOpacity>
                    )
                )}
            </View>

            <Animated.View style={{ width: cancelWidth, overflow: 'hidden' }}>
                <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                    <Text style={styles.cancelText} numberOfLines={1}>Cancel</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary.white,
        borderRadius: borderRadius.lg,
        height: 44, // iOS standard height
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    icon: {
        marginLeft: spacing.sm,
        marginRight: spacing.xs,
    },
    input: {
        flex: 1,
        height: '100%',
        ...typography.body_medium,
        color: colors.secondary.gray_900,
    },
    clearButton: {
        backgroundColor: colors.secondary.gray_400,
        borderRadius: 10,
        padding: 2,
        marginRight: spacing.sm,
    },
    cancelButton: {
        paddingHorizontal: spacing.sm,
        justifyContent: 'center',
        height: 44,
    },
    cancelText: {
        ...typography.body_medium,
        color: colors.secondary.gray_900,
    },
});

export default SearchBar;
