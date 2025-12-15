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
import { colors, spacing, typography, borderRadius, shadows } from '@zomato/design-tokens';

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
                    <ArrowLeft size={24} color={colors.secondary.gray_900} />
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
                            <Navigation size={24} color="#fff" />
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
                            <Map size={24} color="#fff" />
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
                            <Edit3 size={24} color="#fff" />
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
        backgroundColor: colors.secondary.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        backgroundColor: colors.secondary.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.gray_100,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        ...typography.h4,
        color: colors.secondary.gray_900,
    },
    headerRight: {
        width: 32,
    },
    content: {
        flex: 1,
        padding: spacing.xl,
        alignItems: 'center',
    },
    illustration: {
        width: 140,
        height: 140,
        marginBottom: spacing.xl,
    },
    title: {
        ...typography.h3,
        color: colors.secondary.gray_900,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    subtitle: {
        ...typography.body_medium,
        color: colors.secondary.gray_600,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    optionsContainer: {
        width: '100%',
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary.white,
        borderRadius: borderRadius.xl,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.secondary.gray_200,
        ...shadows.sm,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    currentLocationIcon: {
        backgroundColor: '#4CAF50',
    },
    mapIcon: {
        backgroundColor: colors.primary.zomato_red,
    },
    manualIcon: {
        backgroundColor: '#2196F3',
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        ...typography.h4,
        color: colors.secondary.gray_900,
        fontSize: 16,
        marginBottom: 2,
    },
    optionDescription: {
        ...typography.caption,
        color: colors.secondary.gray_600,
        lineHeight: 18,
    },
});

export default AddAddressScreen;
