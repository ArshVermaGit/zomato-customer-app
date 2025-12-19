import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { X } from 'lucide-react-native';

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
}

const FILTER_SECTIONS = [
    {
        title: 'Sort by',
        key: 'sort',
        options: [
            { label: 'Relevance', value: 'relevance' },
            { label: 'Rating: High to Low', value: 'rating_desc' },
            { label: 'Delivery Time', value: 'time_asc' },
            { label: 'Cost: Low to High', value: 'cost_asc' },
            { label: 'Cost: High to Low', value: 'cost_desc' },
        ],
        multi: false,
    },
    {
        title: 'Cuisine',
        key: 'cuisine',
        options: [
            { label: 'North Indian', value: 'north_indian' },
            { label: 'Chinese', value: 'chinese' },
            { label: 'Italian', value: 'italian' },
            { label: 'South Indian', value: 'south_indian' },
            { label: 'Fast Food', value: 'fast_food' },
        ],
        multi: true,
    },
    {
        title: 'Rating',
        key: 'rating',
        options: [
            { label: 'Any', value: 'any' },
            { label: '3.5+', value: '3.5' },
            { label: '4.0+', value: '4.0' },
            { label: '4.5+', value: '4.5' },
        ],
        multi: false,
    },
    {
        title: 'Dietary',
        key: 'dietary',
        options: [
            { label: 'Pure Veg', value: 'veg' },
            { label: 'Non Veg', value: 'non_veg' },
            { label: 'Contains Egg', value: 'egg' },
        ],
        multi: true,
    }
];

const FilterModal = ({ visible, onClose, onApply }: FilterModalProps) => {
    const [selectedFilters, setSelectedFilters] = useState<any>({
        sort: 'relevance',
        cuisine: [],
        rating: 'any',
        dietary: [],
    });

    const handleSelect = (sectionKey: string, value: string, multi: boolean) => {
        if (multi) {
            const current = selectedFilters[sectionKey] || [];
            if (current.includes(value)) {
                setSelectedFilters({ ...selectedFilters, [sectionKey]: current.filter((v: string) => v !== value) });
            } else {
                setSelectedFilters({ ...selectedFilters, [sectionKey]: [...current, value] });
            }
        } else {
            setSelectedFilters({ ...selectedFilters, [sectionKey]: value });
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>

                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Filters</Text>
                        <TouchableOpacity onPress={onClose}>
                            <X color="#333" size={24} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollContent}>
                        {FILTER_SECTIONS.map((section) => (
                            <View key={section.key} style={styles.section}>
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                                <View style={styles.optionsGrid}>
                                    {section.options.map((option) => {
                                        const isSelected = section.multi
                                            ? selectedFilters[section.key]?.includes(option.value)
                                            : selectedFilters[section.key] === option.value;

                                        return (
                                            <TouchableOpacity
                                                key={option.value}
                                                style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                                                onPress={() => handleSelect(section.key, option.value, section.multi)}
                                            >
                                                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                                                    {option.label}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={() => setSelectedFilters({ sort: 'relevance', cuisine: [], rating: 'any', dietary: [] })}
                        >
                            <Text style={styles.clearText}>Clear all</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyButton} onPress={() => onApply(selectedFilters)}>
                            <Text style={styles.applyText}>Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    container: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    scrollContent: {
        padding: 20,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    optionChip: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    optionChipSelected: {
        backgroundColor: '#ffeae6', // Light Zomato Red
        borderColor: '#E23744',
    },
    optionText: {
        color: '#666',
        fontSize: 14,
    },
    optionTextSelected: {
        color: '#E23744',
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignItems: 'center',
    },
    clearButton: {
        flex: 1,
        alignItems: 'center',
    },
    clearText: {
        color: '#666',
        fontSize: 16,
    },
    applyButton: {
        flex: 2,
        backgroundColor: '#E23744',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    applyText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default FilterModal;
