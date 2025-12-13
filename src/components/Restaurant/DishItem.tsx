import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Star } from 'lucide-react-native';

interface DishProps {
    dish: any;
    onAdd: () => void;
    onRemove: () => void;
}

const DishItem = ({ dish, onAdd, onRemove }: DishProps) => {
    const [count, setCount] = useState(0);

    const handleAdd = () => {
        setCount(prev => prev + 1);
        onAdd();
    };

    const handleRemove = () => {
        if (count > 0) {
            setCount(prev => prev - 1);
            onRemove();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.vegIconContainer}>
                    <View style={[
                        styles.vegIconOuter,
                        { borderColor: dish.isVeg ? 'green' : 'red' }
                    ]}>
                        <View style={[
                            styles.vegIconInner,
                            { backgroundColor: dish.isVeg ? 'green' : 'red' }
                        ]} />
                    </View>
                    {dish.bestseller && (
                        <View style={styles.bestsellerBadge}>
                            <Star size={10} color="#E2A03F" fill="#E2A03F" />
                            <Text style={styles.bestsellerText}>Bestseller</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.name}>{dish.name}</Text>
                <Text style={styles.price}>₹{dish.price}</Text>
                <Text style={styles.description} numberOfLines={2}>{dish.description}</Text>
            </View>

            <View style={styles.imageContainer}>
                {dish.image && (
                    <Image source={{ uri: dish.image }} style={styles.image} resizeMode="cover" />
                )}
                <View style={styles.addButtonContainer}>
                    {count === 0 ? (
                        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                            <Text style={styles.addButtonText}>ADD</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.counterButton}>
                            <TouchableOpacity onPress={handleRemove} style={styles.countBtn}>
                                <Text style={styles.counterText}>-</Text>
                            </TouchableOpacity>
                            <Text style={styles.countText}>{count}</Text>
                            <TouchableOpacity onPress={handleAdd} style={styles.countBtn}>
                                <Text style={styles.counterText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                {dish.customizable && <Text style={styles.customizableText}>Customisable</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    content: {
        flex: 1,
        paddingRight: 10,
    },
    vegIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    vegIconOuter: {
        width: 16,
        height: 16,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    vegIconInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    bestsellerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5E6',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 4,
    },
    bestsellerText: {
        fontSize: 10,
        color: '#E2A03F',
        marginLeft: 3,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    price: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
        fontWeight: '500',
    },
    description: {
        fontSize: 12,
        color: '#888',
        lineHeight: 16,
    },
    imageContainer: {
        alignItems: 'center',
        width: 120,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 15,
    },
    addButtonContainer: {
        marginTop: -20, // Overlap image
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    addButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E23744',
    },
    addButtonText: {
        color: '#E23744',
        fontWeight: 'bold',
        fontSize: 16,
    },
    counterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E23744',
        overflow: 'hidden',
    },
    countBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    counterText: {
        color: '#E23744',
        fontSize: 18,
        fontWeight: 'bold',
    },
    countText: {
        paddingHorizontal: 8,
        color: '#333',
        fontWeight: 'bold',
    },
    customizableText: {
        fontSize: 10,
        color: '#888',
        marginTop: 5,
    },
});

export default DishItem;
