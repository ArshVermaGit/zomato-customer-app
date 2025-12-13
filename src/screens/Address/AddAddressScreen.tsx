/**
 * AddAddressScreen
 * Options to add address via map selection or manual entry
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Map, Edit3, Navigation } from 'lucide-react-native';
import type { AddressStackParamList } from '../../types/address.types';

type NavigationProp = StackNavigationProp<AddressStackParamList, 'AddAddress'>;

const AddAddressScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleSelectFromMap = () => {
        navigation.navigate('SelectLocationMap', {});
    };

    const handleEnterManually = () => {
        // Navigate to form with default Delhi coordinates
        navigation.navigate('AddressForm', {
            latitude: 28.6139,
            longitude: 77.2090,
            formattedAddress: 'New Delhi, Delhi, India',
            city: 'New Delhi',
            state: 'Delhi',
            postalCode: '110001',
            country: 'India',
        });
    };

    const handleUseCurrentLocation = () => {
        // In a real app, we'd request location permission and get current coordinates
        // For now, navigate to map with Delhi coordinates
        navigation.navigate('SelectLocationMap', {
            initialLatitude: 28.6139,
            initialLongitude: 77.2090,
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add New Address</Text>
                <View style={styles.headerRight} />
            </View>

            <View style={styles.content}>
                <Image
                    source={{
                        uri: 'https://cdn-icons-png.flaticon.com/512/854/854878.png',
                    }}
                    style={styles.illustration}
                    resizeMode="contain"
                />

                <Text style={styles.title}>How would you like to add your address?</Text>
                <Text style={styles.subtitle}>
                    Choose a method that works best for you
                </Text>

                <View style={styles.optionsContainer}>
                    {/* Use Current Location */}
                    <TouchableOpacity
                        style={styles.optionCard}
                        onPress={handleUseCurrentLocation}
                    >
                        <View style={[styles.iconContainer, styles.currentLocationIcon]}>
                            <Navigation size={28} color="#fff" />
                        </View>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionTitle}>Use Current Location</Text>
                            <Text style={styles.optionDescription}>
                                Automatically detect your location using GPS
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Select from Map */}
                    <TouchableOpacity
                        style={styles.optionCard}
                        onPress={handleSelectFromMap}
                    >
                        <View style={[styles.iconContainer, styles.mapIcon]}>
                            <Map size={28} color="#fff" />
                        </View>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionTitle}>Select from Map</Text>
                            <Text style={styles.optionDescription}>
                                Pin your exact location on the map
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Enter Manually */}
                    <TouchableOpacity
                        style={styles.optionCard}
                        onPress={handleEnterManually}
                    >
                        <View style={[styles.iconContainer, styles.manualIcon]}>
                            <Edit3 size={28} color="#fff" />
                        </View>
                        <View style={styles.optionContent}>
                            <Text style={styles.optionTitle}>Enter Manually</Text>
                            <Text style={styles.optionDescription}>
                                Type in your complete address details
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    headerRight: {
        width: 32,
    },
    content: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
    },
    illustration: {
        width: 140,
        height: 140,
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
    },
    optionsContainer: {
        width: '100%',
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    currentLocationIcon: {
        backgroundColor: '#4CAF50',
    },
    mapIcon: {
        backgroundColor: '#E23744',
    },
    manualIcon: {
        backgroundColor: '#2196F3',
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
});

export default AddAddressScreen;
