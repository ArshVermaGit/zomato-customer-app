import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface TipSelectorProps {
    selectedTip: number;
    onSelectTip: (amount: number) => void;
}

const TIPS = [0, 20, 30, 50, 100];

const TipSelector = ({ selectedTip, onSelectTip }: TipSelectorProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Tip your delivery partner</Text>
                <Text style={styles.subtitle}>Thank your delivery partner for helping you stay safe indoors. Support them through these tough times.</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {TIPS.map((amount) => (
                    <TouchableOpacity
                        key={amount}
                        style={[
                            styles.chip,
                            selectedTip === amount && styles.selectedChip
                        ]}
                        onPress={() => onSelectTip(amount)}
                    >
                        <Text style={[
                            styles.chipText,
                            selectedTip === amount && styles.selectedChipText
                        ]}>
                            {amount === 0 ? 'None' : `₹${amount}`}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
    },
    header: {
        marginBottom: 15,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: '#888',
        lineHeight: 16,
    },
    scroll: {
        paddingVertical: 5,
    },
    chip: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        backgroundColor: '#fff',
    },
    selectedChip: {
        borderColor: '#E23744',
        backgroundColor: '#FFF5F6',
    },
    chipText: {
        fontSize: 14,
        color: '#666',
        fontWeight: 'bold',
    },
    selectedChipText: {
        color: '#E23744',
    },
});

export default TipSelector;
