import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';

const CATEGORIES = [
    { id: '1', name: 'Biryani', image: 'https://b.zmtcdn.com/data/o2_assets/d0bd7c9405ac87f6aa65e31fe55800941632716575.png' },
    { id: '2', name: 'Pizza', image: 'https://b.zmtcdn.com/data/o2_assets/d0bd7c9405ac87f6aa65e31fe55800941632716575.png' }, // Reuse placeholder or find better ones
    { id: '3', name: 'Burger', image: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' },
    { id: '4', name: 'Chicken', image: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png' },
    { id: '5', name: 'Rolls', image: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' },
    { id: '6', name: 'Thali', image: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png' },
];

const CategoryRail = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Eat what makes you happy</Text>
            <FlatList
                data={CATEGORIES}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15 }}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
                        </View>
                        <Text style={styles.label}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 20,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 15,
        marginBottom: 15,
        color: '#333',
    },
    item: {
        alignItems: 'center',
        marginRight: 20,
    },
    imageContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#fff',
        elevation: 2, // Shadow for Android
        shadowColor: '#000', // Shadow for iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    image: {
        width: 40,
        height: 40,
    },
    label: {
        fontSize: 12,
        fontWeight: '500',
        color: '#333',
    },
});

export default CategoryRail;
