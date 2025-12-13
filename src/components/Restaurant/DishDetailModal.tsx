import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { X, Minus, Plus, Star } from 'lucide-react-native';

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

    const handleSubmit = () => {
        if (!isValid) return;
        onAddToCart({
            ...dish,
            quantity,
            selections,
            specialRequest,
            finalPrice: calculateTotal
        });
        onClose();
    };

    if (!dish) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Close Button */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <X color="#333" size={24} />
                    </TouchableOpacity>

                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {/* Header */}
                        {dish.image && (
                            <Image source={{ uri: dish.image }} style={styles.image} resizeMode="cover" />
                        )}

                        <View style={styles.headerInfo}>
                            <View style={styles.vegIconContainer}>
                                <View style={[styles.vegIconOuter, { borderColor: dish.isVeg ? 'green' : 'red' }]}>
                                    <View style={[styles.vegIconInner, { backgroundColor: dish.isVeg ? 'green' : 'red' }]} />
                                </View>
                                {dish.bestseller && (
                                    <View style={styles.bestsellerBadge}>
                                        <Star size={12} color="#E2A03F" fill="#E2A03F" />
                                        <Text style={styles.bestsellerText}>Bestseller</Text>
                                    </View>
                                )}
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
                                    {group.required && <Text style={styles.requiredBadge}>Required</Text>}
                                </View>

                                {group.options.map((option: any) => {
                                    const isSelected = group.type === 'radio'
                                        ? selections[group.id] === option.id
                                        : selections[group.id]?.includes(option.id);

                                    return (
                                        <TouchableOpacity
                                            key={option.id}
                                            style={styles.optionRow}
                                            onPress={() => handleOptionSelect(group.id, option.id, group.type)}
                                        >
                                            <View style={styles.optionInfo}>
                                                <View style={[
                                                    styles.radioOuter,
                                                    group.type === 'checkbox' && { borderRadius: 4 },
                                                    isSelected && { borderColor: '#E23744' }
                                                ]}>
                                                    {isSelected && <View style={[
                                                        styles.radioInner,
                                                        group.type === 'checkbox' && { borderRadius: 2, width: 10, height: 10 }
                                                    ]} />}
                                                </View>
                                                <Text style={styles.optionName}>{option.name}</Text>
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
                                placeholder="Any specific requests? (optional)"
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
                            <TouchableOpacity onPress={() => quantity > 1 && setQuantity(q => q - 1)} disabled={quantity <= 1}>
                                <Minus color={quantity > 1 ? "#E23744" : "#ccc"} size={20} />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity onPress={() => setQuantity(q => q + 1)}>
                                <Plus color="#E23744" size={20} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.addButton, !isValid && styles.disabledButton]}
                            onPress={handleSubmit}
                            disabled={!isValid}
                        >
                            <Text style={styles.addButtonText}>Add item ₹{calculateTotal}</Text>
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#fff',
        height: '90%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 5,
        elevation: 5,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    image: {
        width: '100%',
        height: 250,
    },
    headerInfo: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    vegIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    vegIconOuter: {
        width: 16,
        height: 16,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
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
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    price: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    groupContainer: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    groupHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    groupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    requiredBadge: {
        fontSize: 12,
        color: '#fff',
        backgroundColor: '#666',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    optionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#E23744',
    },
    optionName: {
        fontSize: 16,
        color: '#333',
    },
    optionPrice: {
        fontSize: 14,
        color: '#666',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        fontSize: 14,
        color: '#333',
        minHeight: 80,
        textAlignVertical: 'top',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        elevation: 10,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E23744',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginRight: 15,
    },
    quantityText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginHorizontal: 15,
    },
    addButton: {
        flex: 1,
        backgroundColor: '#E23744',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default DishDetailModal;
