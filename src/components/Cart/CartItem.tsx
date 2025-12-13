import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart } from '../../store/slices/cartSlice';

interface CartItemProps {
    item: any;
}

const CartItem = ({ item }: CartItemProps) => {
    const dispatch = useDispatch();

    const handleIncrement = () => {
        dispatch(updateQuantity({ id: item.id, change: 1 }));
    };

    const handleDecrement = () => {
        if (item.quantity > 1) {
            dispatch(updateQuantity({ id: item.id, change: -1 }));
        } else {
            dispatch(removeFromCart({ id: item.id }));
        }
    };

    const selectionsText = item.selections ? Object.values(item.selections).flat().join(', ') : '';

    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <View style={[styles.vegIconOuter, { borderColor: item.isVeg ? 'green' : 'red' }]}>
                    <View style={[styles.vegIconInner, { backgroundColor: item.isVeg ? 'green' : 'red' }]} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    {selectionsText ? <Text style={styles.selections}>{selectionsText}</Text> : null}
                    <Text style={styles.price}>₹{item.finalPrice * item.quantity}</Text>
                </View>
            </View>

            <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={handleDecrement} style={styles.qtyButton}>
                    <Minus size={16} color="#E23744" />
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity onPress={handleIncrement} style={styles.qtyButton}>
                    <Plus size={16} color="#E23744" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    infoContainer: {
        flexDirection: 'row',
        flex: 1,
        marginRight: 10,
    },
    vegIconOuter: {
        width: 16,
        height: 16,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginTop: 4,
    },
    vegIconInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        color: '#333',
        marginBottom: 4,
    },
    selections: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E23744',
        borderRadius: 8,
        backgroundColor: '#FFF5F6',
    },
    qtyButton: {
        padding: 8,
    },
    quantity: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#E23744',
        marginHorizontal: 8,
    },
});

export default CartItem;
