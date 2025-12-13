/**
 * QuickTags Component
 * Selectable chips for quick feedback
 */

import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';

interface QuickTagsProps {
    tags: string[];
    selectedTags: string[];
    onToggleTag: (tag: string) => void;
}

const QuickTags: React.FC<QuickTagsProps> = ({ tags, selectedTags, onToggleTag }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>What did you like?</Text>
            <View style={styles.tagsContainer}>
                {tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                        <TouchableOpacity
                            key={tag}
                            style={[
                                styles.tag,
                                isSelected && styles.selectedTag
                            ]}
                            onPress={() => onToggleTag(tag)}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.tagText,
                                isSelected && styles.selectedTagText
                            ]}>
                                {tag}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
        textAlign: 'center',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
    },
    tag: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    selectedTag: {
        backgroundColor: '#FFF3E0',
        borderColor: '#FF9800',
    },
    tagText: {
        fontSize: 13,
        color: '#666',
    },
    selectedTagText: {
        color: '#EF6C00',
        fontWeight: '500',
    },
});

export default QuickTags;
