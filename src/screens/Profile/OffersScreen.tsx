/**
 * Offers Screen
 * List of available promo codes
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, Clipboard, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, Ticket, Copy } from 'lucide-react-native';

import { RootState, AppDispatch } from '../../store/store';
import { fetchOffers } from '../../store/slices/authSlice';
import { Offer } from '../../types/user.types';

const OffersScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const { offers, isLoading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        dispatch(fetchOffers());
    }, []);

    const handleCopy = (code: string) => {
        Clipboard.setString(code);
        Alert.alert('Copied', 'Offer code copied to clipboard');
    };

    const renderItem = ({ item }: { item: Offer }) => (
        <View style={styles.card}>
            <View style={styles.leftSection}>
                <View style={styles.iconContainer}>
                    <Ticket size={24} color="#E23744" />
                </View>
                <View style={styles.dashedLine} />
            </View>
            <View style={styles.rightSection}>
                <View style={styles.headerRow}>
                    <Text style={styles.code}>{item.code}</Text>
                    <TouchableOpacity onPress={() => handleCopy(item.code)} style={styles.copyButton}>
                        <Text style={styles.copyText}>COPY</Text>
                        <Copy size={14} color="#E23744" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>

                <View style={styles.divider} />

                <Text style={styles.termsLabel}>Terms & Conditions</Text>
                {item.terms.map((term, index) => (
                    <Text key={index} style={styles.term}>• {term}</Text>
                ))}
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Offers & Promos</Text>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={offers}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                refreshing={isLoading}
                onRefresh={() => dispatch(fetchOffers())}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    listContent: {
        padding: 16,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    leftSection: {
        width: 60,
        backgroundColor: '#FFF5F6',
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: '#FFEBEE',
        position: 'relative',
    },
    iconContainer: {
        // justifyContent: 'center',
        // alignItems: 'center',
        // flex: 1, 
    },
    dashedLine: {
        position: 'absolute',
        right: -1,
        top: 10,
        bottom: 10,
        width: 1,
        borderWidth: 1,
        borderColor: '#E23744',
        borderStyle: 'dashed',
        backgroundColor: 'transparent',
        zIndex: 1,
    },
    rightSection: {
        flex: 1,
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    code: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        overflow: 'hidden',
        letterSpacing: 1,
    },
    copyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    copyText: {
        color: '#E23744',
        fontWeight: '600',
        fontSize: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#E23744',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: 12,
    },
    termsLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    term: {
        fontSize: 11,
        color: '#666',
        marginBottom: 2,
    },
});

export default OffersScreen;
