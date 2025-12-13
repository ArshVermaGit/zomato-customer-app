import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MapPin, Clock } from 'lucide-react-native';

export const InfoTab = ({ restaurant }: { restaurant: any }) => {
    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.sectionTitle}>About this place</Text>

            <View style={styles.row}>
                <MapPin color="#666" size={20} />
                <Text style={styles.text}>{restaurant.address}</Text>
            </View>

            <View style={styles.row}>
                <Clock color="#666" size={20} />
                <Text style={styles.text}>{restaurant.timings}</Text>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Cuisines</Text>
            <Text style={styles.text}>{restaurant.cuisine}</Text>

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Average Cost</Text>
            <Text style={styles.text}>{restaurant.priceForTwo}</Text>
        </ScrollView>
    );
};

export const ReviewsTab = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Reviews coming soon</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    text: {
        fontSize: 16,
        color: '#666',
        marginLeft: 10,
        lineHeight: 22,
    },
});
