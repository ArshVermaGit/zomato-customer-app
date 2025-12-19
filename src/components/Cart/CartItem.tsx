import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart } from '../../store/slices/cartSlice';
import Animated, { FadeOutLeft, FadeIn } from 'react-native-reanimated';
import { colors, spacing, typography, borderRadius } from '@zomato/design-tokens';

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
            // Check if we want to confirm, but effectively this triggers removal
            // Animation will be handled by the exiting prop
            dispatch(removeFromCart({ id: item.id }));
        }
    };

    const selectionsText = item.selections ? Object.values(item.selections).flat().join(', ') : '';

    return (
        <Animated.View
            entering={FadeIn}
            exiting={FadeOutLeft}
            style={styles.container}
        >
            <View style={styles.infoContainer}>
                <View style={[styles.vegIconOuter, { borderColor: item.isVeg ? '#24963F' : '#E23744' }]}>
                    <View style={[styles.vegIconInner, { backgroundColor: item.isVeg ? '#24963F' : '#E23744' }]} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{item.name}</Text>
                    {selectionsText ? <Text style={styles.selections}>{selectionsText}</Text> : null}
                    <Text style={styles.price}>₹{item.finalPrice * item.quantity}</Text>
                </View>
            </View>

            <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={handleDecrement} style={styles.qtyButton}>
                    <Minus size={14} color={colors.primary.zomato_red} />
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity onPress={handleIncrement} style={styles.qtyButton}>
                    <Plus size={14} color={colors.primary.zomato_red} />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.lg,
        backgroundColor: colors.secondary.white,
    },
    infoContainer: {
        flexDirection: 'row',
        flex: 1,
        marginRight: spacing.md,
    },
    vegIconOuter: {
        width: 14,
        height: 14,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
        marginTop: 4,
        borderRadius: 3,
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
        ...typography.body_large,
        color: colors.secondary.gray_900,
        marginBottom: 2,
    },
    selections: {
        ...typography.caption,
        color: colors.secondary.gray_500,
        marginBottom: 2,
    },
    price: {
        ...typography.body_medium,
        fontWeight: '600',
        color: colors.secondary.gray_900,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.primary.zomato_red_light,
        borderRadius: borderRadius.md,
        backgroundColor: '#FFF5F6',
        height: 32,
    },
    qtyButton: {
        paddingHorizontal: 8,
        height: '100%',
        justifyContent: 'center',
    },
    quantity: {
        ...typography.body_medium,
        fontWeight: 'bold',
        color: colors.primary.zomato_red,
        minWidth: 16,
        textAlign: 'center',
    },
});

export default CartItem;
