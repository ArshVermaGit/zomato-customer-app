import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, Image, TouchableOpacity, ScrollView, TextInput, Pressable } from 'react-native';
import { X, Minus, Plus, Star, Check } from 'lucide-react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
} from 'react-native-reanimated';
import { colors, spacing, typography, borderRadius, shadows } from '@zomato/design-tokens';

// Animated Components
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface DishDetailModalProps {
    visible: boolean;
    dish: any;
    onClose: () => void;
    onAddToCart: (item: any) => void;
}

const DishDetailModal = ({ visible, dish, onClose, onAddToCart }: DishDetailModalProps) => {
    const [quantity, setQuantity] = useState(1);
    const [selections, setSelections] = useState<any>({});
    const [specialRequest, setSpecialRequest] = useState('');

    // Animation Values
    const scaleQty = useSharedValue(1);
    const scaleAddBtn = useSharedValue(1);

    useEffect(() => {
        if (visible) {
            setQuantity(1);
            setSelections(getDefaultSelections());
            setSpecialRequest('');
        }
    }, [visible, dish]);

    const getDefaultSelections = () => {
        const defaults: any = {};
        dish?.customization?.forEach((group: any) => {
            if (group.type === 'radio' && group.required && group.options.length > 0) {
                defaults[group.id] = group.options[0].id; // Default to first for required radio
            } else if (group.type === 'checkbox') {
                defaults[group.id] = [];
            }
        });
        return defaults;
    };

    const handleOptionSelect = (groupId: string, optionId: string, type: 'radio' | 'checkbox') => {
        setSelections((prev: any) => {
            if (type === 'radio') {
                return { ...prev, [groupId]: optionId };
            } else {
                const current = prev[groupId] || [];
                const updated = current.includes(optionId)
                    ? current.filter((id: string) => id !== optionId)
                    : [...current, optionId];
                return { ...prev, [groupId]: updated };
            }
        });
    };

    const calculateTotal = useMemo(() => {
        if (!dish) return 0;
        let total = dish.price;

        dish.customization?.forEach((group: any) => {
            if (group.type === 'radio') {
                const selectedOptionId = selections[group.id];
                const option = group.options.find((o: any) => o.id === selectedOptionId);
                if (option) total += option.price;
            } else if (group.type === 'checkbox') {
                const selectedIds = selections[group.id] || [];
                selectedIds.forEach((id: string) => {
                    const option = group.options.find((o: any) => o.id === id);
                    if (option) total += option.price;
                });
            }
        });

        return total * quantity;
    }, [dish, selections, quantity]);

    const isValid = useMemo(() => {
        if (!dish?.customization) return true;
        return dish.customization.every((group: any) => {
            if (group.required) {
                if (group.type === 'radio') return !!selections[group.id];
                // Checkbox required logic could be added here (e.g., at least 1)
            }
            return true;
        });
    }, [dish, selections]);

    const handleIncrement = () => {
        setQuantity(q => q + 1);
        scaleQty.value = withSequence(withSpring(1.2), withSpring(1));
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(q => q - 1);
            scaleQty.value = withSequence(withSpring(0.9), withSpring(1));
        }
    };

    const handleSubmit = () => {
        if (!isValid) return;

        // Button Animation
        scaleAddBtn.value = withSequence(withSpring(0.95), withSpring(1));

        // Delay close slightly to show animation
        setTimeout(() => {
            onAddToCart({
                ...dish,
                quantity,
                selections,
                specialRequest,
                finalPrice: calculateTotal
            });
            onClose();
        }, 150);
    };

    // Animated Styles
    const qtyStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scaleQty.value }]
    }));

    const btnStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scaleAddBtn.value }]
    }));

    if (!dish) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Close Button */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <X color={colors.secondary.gray_900} size={20} />
                    </TouchableOpacity>

                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {/* Header Image (Optional) */}
                        {dish.image && (
                            <Image source={{ uri: dish.image }} style={styles.image} resizeMode="cover" />
                        )}

                        <View style={styles.headerInfo}>
                            <View style={styles.rowBetween}>
                                <View style={styles.vegIconContainer}>
                                    <View style={[styles.vegIconOuter, { borderColor: dish.isVeg ? '#24963F' : '#E23744' }]}>
                                        <View style={[styles.vegIconInner, { backgroundColor: dish.isVeg ? '#24963F' : '#E23744' }]} />
                                    </View>
                                    {dish.bestseller && (
                                        <View style={styles.bestsellerBadge}>
                                            <Star size={10} color="#E2A03F" fill="#E2A03F" />
                                            <Text style={styles.bestsellerText}>Bestseller</Text>
                                        </View>
                                    )}
                                </View>
                            </View>

                            <Text style={styles.title}>{dish.name}</Text>
                            <Text style={styles.price}>₹{dish.price}</Text>
                            <Text style={styles.description}>{dish.description}</Text>
                        </View>

                        {/* Customization Groups */}
                        {dish.customization?.map((group: any) => (
                            <View key={group.id} style={styles.groupContainer}>
                                <View style={styles.groupHeader}>
                                    <Text style={styles.groupTitle}>{group.name}</Text>
                                    {group.required && <View style={styles.requiredChip}><Text style={styles.requiredText}>Required</Text></View>}
                                </View>

                                {group.options.map((option: any) => {
                                    const isSelected = group.type === 'radio'
                                        ? selections[group.id] === option.id
                                        : selections[group.id]?.includes(option.id);

                                    return (
                                        <TouchableOpacity
                                            key={option.id}
                                            style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                                            onPress={() => handleOptionSelect(group.id, option.id, group.type)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={styles.optionInfo}>
                                                {/* Visual Selection Indicator */}
                                                <View style={[
                                                    styles.selectorOuter,
                                                    group.type === 'checkbox' && styles.checkboxOuter,
                                                    isSelected && styles.selectorActive
                                                ]}>
                                                    {isSelected && (
                                                        group.type === 'radio' ? (
                                                            <View style={styles.radioInner} />
                                                        ) : (
                                                            <Check size={12} color="white" />
                                                        )
                                                    )}
                                                </View>
                                                <Text style={[styles.optionName, isSelected && styles.optionNameActive]}>{option.name}</Text>
                                            </View>
                                            <Text style={styles.optionPrice}>
                                                {option.price > 0 ? `+ ₹${option.price}` : 'Free'}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        ))}

                        {/* Special Request */}
                        <View style={styles.groupContainer}>
                            <Text style={styles.groupTitle}>Special Instructions</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="E.g. Less spicy, keep sauce separate..."
                                placeholderTextColor={colors.secondary.gray_500}
                                maxLength={200}
                                value={specialRequest}
                                onChangeText={setSpecialRequest}
                                multiline
                            />
                        </View>

                        {/* Bottom Padding */}
                        <View style={{ height: 100 }} />
                    </ScrollView>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity onPress={handleDecrement} disabled={quantity <= 1} style={styles.qtyBtn}>
                                <Minus color={quantity > 1 ? colors.primary.zomato_red : colors.secondary.gray_400} size={20} />
                            </TouchableOpacity>
                            <Animated.Text style={[styles.quantityText, qtyStyle]}>{quantity}</Animated.Text>
                            <TouchableOpacity onPress={handleIncrement} style={styles.qtyBtn}>
                                <Plus color={colors.primary.zomato_red} size={20} />
                            </TouchableOpacity>
                        </View>

                        <AnimatedPressable
                            style={[styles.addButton, !isValid && styles.disabledButton, btnStyle]}
                            onPress={handleSubmit}
                            disabled={!isValid}
                        >
                            <Text style={styles.addButtonText}>Add item ₹{calculateTotal}</Text>
                        </AnimatedPressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)', // Darker dim
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: colors.secondary.white,
        height: '85%', // Bottom sheet height
        borderTopLeftRadius: borderRadius['2xl'],
        borderTopRightRadius: borderRadius['2xl'],
        overflow: 'hidden',
        ...shadows.xl,
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        backgroundColor: colors.secondary.white,
        borderRadius: borderRadius.full,
        padding: 8,
        ...shadows.sm,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    image: {
        width: '100%',
        height: 200,
    },
    headerInfo: {
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.gray_100,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    vegIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    vegIconOuter: {
        width: 16,
        height: 16,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        borderRadius: 2, // Soft square
    },
    vegIconInner: {
        width: 8,
        height: 8,
        borderRadius: 4, // Circle
    },
    bestsellerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5E6',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    bestsellerText: {
        fontSize: 10,
        color: '#E2A03F',
        marginLeft: 4,
        fontWeight: 'bold',
    },
    title: {
        ...typography.h3,
        color: colors.secondary.gray_900,
        marginBottom: 4,
    },
    price: {
        ...typography.h4,
        color: colors.secondary.gray_900,
        marginBottom: 8,
    },
    description: {
        ...typography.body_medium,
        color: colors.secondary.gray_600,
        lineHeight: 20,
    },
    groupContainer: {
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.gray_100,
    },
    groupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    groupTitle: {
        ...typography.h4,
        color: colors.secondary.gray_900,
    },
    requiredChip: {
        backgroundColor: colors.secondary.gray_100,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    requiredText: {
        ...typography.caption,
        color: colors.secondary.gray_600,
        fontWeight: '600',
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    optionRowSelected: {
        // Optional highlight
    },
    optionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectorOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.secondary.gray_400,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    checkboxOuter: {
        borderRadius: 4,
    },
    selectorActive: {
        borderColor: colors.primary.zomato_red,
        // Actually for radio we want border red, inner red.
        // For checkbox we want fill red.
        // Let's simplify:
        backgroundColor: 'transparent',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary.zomato_red,
    },
    // Styles Fix for Selector
    optionName: {
        ...typography.body_medium,
        color: colors.secondary.gray_900,
    },
    optionNameActive: {
        fontWeight: '600',
    },
    optionPrice: {
        ...typography.body_medium,
        color: colors.secondary.gray_600,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.secondary.gray_300,
        borderRadius: borderRadius.lg,
        padding: 12,
        ...typography.body_medium,
        color: colors.secondary.gray_900,
        minHeight: 80,
        textAlignVertical: 'top',
        backgroundColor: colors.secondary.gray_50,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.secondary.white,
        padding: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.secondary.gray_100,
        ...shadows.lg, // lift it up
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.primary.zomato_red_light, // Softer border
        borderRadius: borderRadius.lg,
        paddingHorizontal: 4,
        paddingVertical: 4,
        marginRight: spacing.lg,
        backgroundColor: colors.secondary.gray_50,
    },
    qtyBtn: {
        padding: 8,
    },
    quantityText: {
        ...typography.h4,
        color: colors.secondary.gray_900,
        marginHorizontal: 12,
        minWidth: 20,
        textAlign: 'center',
    },
    addButton: {
        flex: 1,
        backgroundColor: colors.primary.zomato_red,
        borderRadius: borderRadius.lg,
        paddingVertical: 14,
        alignItems: 'center',
        ...shadows.md,
    },
    disabledButton: {
        backgroundColor: colors.secondary.gray_400,
        elevation: 0,
    },
    addButtonText: {
        ...typography.h4,
        color: colors.secondary.white,
    },
});

export default DishDetailModal;
