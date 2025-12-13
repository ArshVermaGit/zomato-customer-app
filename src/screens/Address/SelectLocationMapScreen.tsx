/**
 * SelectLocationMapScreen
 * Full-screen map for selecting delivery location with search and current location
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { ArrowLeft, Navigation, MapPin } from 'lucide-react-native';
import type { AddressStackParamList, ReverseGeocodingResult, GeocodingResult } from '../../types/address.types';
import { AddressService } from '../../services/address.service';
import { LocationSearchBar } from '../../components/Address';
import type { LocationSuggestion } from '../../types/address.types';

type NavigationProp = StackNavigationProp<AddressStackParamList, 'SelectLocationMap'>;
type RouteProps = RouteProp<AddressStackParamList, 'SelectLocationMap'>;

const { width, height } = Dimensions.get('window');

const DEFAULT_REGION = {
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
};

const SelectLocationMapScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const mapRef = useRef<MapView>(null);

    const initialLat = route.params?.initialLatitude ?? DEFAULT_REGION.latitude;
    const initialLng = route.params?.initialLongitude ?? DEFAULT_REGION.longitude;

    const [region, setRegion] = useState<Region>({
        ...DEFAULT_REGION,
        latitude: initialLat,
        longitude: initialLng,
    });
    const [addressInfo, setAddressInfo] = useState<ReverseGeocodingResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingAddress, setIsFetchingAddress] = useState(false);

    const fetchAddress = useCallback(async (lat: number, lng: number) => {
        setIsFetchingAddress(true);
        try {
            const result = await AddressService.reverseGeocode(lat, lng);
            setAddressInfo(result);
        } catch (error) {
            console.error('Reverse geocoding failed:', error);
        } finally {
            setIsFetchingAddress(false);
        }
    }, []);

    useEffect(() => {
        fetchAddress(initialLat, initialLng);
    }, [initialLat, initialLng, fetchAddress]);

    const handleRegionChangeComplete = (newRegion: Region) => {
        setRegion(newRegion);
        fetchAddress(newRegion.latitude, newRegion.longitude);
    };

    const handleSelectLocation = async (suggestion: LocationSuggestion) => {
        setIsLoading(true);
        try {
            const details = await AddressService.getPlaceDetails(suggestion.placeId);
            if (details) {
                const newRegion = {
                    latitude: details.latitude,
                    longitude: details.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                };
                mapRef.current?.animateToRegion(newRegion, 500);
                setRegion(newRegion);
                setAddressInfo({
                    formattedAddress: details.formattedAddress,
                    city: details.city,
                    state: details.state,
                    postalCode: details.postalCode,
                    country: details.country,
                });
            }
        } catch (error) {
            console.error('Failed to get place details:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCurrentLocation = () => {
        // In a real app, we would use Geolocation API
        // For now, animate to Delhi
        const currentRegion = {
            latitude: 28.6139,
            longitude: 77.2090,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        };
        mapRef.current?.animateToRegion(currentRegion, 500);
        setRegion(currentRegion);
        fetchAddress(currentRegion.latitude, currentRegion.longitude);
    };

    const handleConfirmLocation = () => {
        if (!addressInfo) return;

        navigation.navigate('AddressForm', {
            latitude: region.latitude,
            longitude: region.longitude,
            formattedAddress: addressInfo.formattedAddress,
            city: addressInfo.city,
            state: addressInfo.state,
            postalCode: addressInfo.postalCode,
            country: addressInfo.country,
            street: addressInfo.street,
            editAddressId: route.params?.editAddressId,
        });
    };

    return (
        <View style={styles.container}>
            {/* Map */}
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    ...DEFAULT_REGION,
                    latitude: initialLat,
                    longitude: initialLng,
                }}
                onRegionChangeComplete={handleRegionChangeComplete}
                showsUserLocation
                showsMyLocationButton={false}
            />

            {/* Center Pin */}
            <View style={styles.centerPin}>
                <View style={styles.pinContainer}>
                    <View style={styles.pin}>
                        <MapPin size={24} color="#fff" />
                    </View>
                    <View style={styles.pinShadow} />
                </View>
            </View>

            {/* Header with Search */}
            <SafeAreaView style={styles.headerContainer} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <ArrowLeft size={24} color="#333" />
                    </TouchableOpacity>
                    <View style={styles.searchContainer}>
                        <LocationSearchBar
                            placeholder="Search for area, street..."
                            onSelectLocation={handleSelectLocation}
                        />
                    </View>
                </View>
            </SafeAreaView>

            {/* Current Location Button */}
            <TouchableOpacity
                style={styles.currentLocationButton}
                onPress={handleCurrentLocation}
            >
                <Navigation size={22} color="#E23744" />
            </TouchableOpacity>

            {/* Bottom Card */}
            <View style={styles.bottomCard}>
                {isFetchingAddress ? (
                    <View style={styles.loadingAddress}>
                        <ActivityIndicator size="small" color="#E23744" />
                        <Text style={styles.loadingText}>Fetching address...</Text>
                    </View>
                ) : addressInfo ? (
                    <>
                        <View style={styles.addressContainer}>
                            <View style={styles.addressIcon}>
                                <MapPin size={20} color="#E23744" />
                            </View>
                            <View style={styles.addressContent}>
                                <Text style={styles.addressLabel}>Delivering to</Text>
                                <Text style={styles.addressText} numberOfLines={2}>
                                    {addressInfo.formattedAddress}
                                </Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.confirmButton,
                                isLoading && styles.confirmButtonDisabled,
                            ]}
                            onPress={handleConfirmLocation}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.confirmButtonText}>
                                    Confirm Location
                                </Text>
                            )}
                        </TouchableOpacity>
                    </>
                ) : (
                    <Text style={styles.noAddressText}>
                        Move the map to select location
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    centerPin: {
        position: 'absolute',
        top: height / 2 - 48,
        left: width / 2 - 20,
        zIndex: 1,
    },
    pinContainer: {
        alignItems: 'center',
    },
    pin: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E23744',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    pinShadow: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'rgba(0,0,0,0.2)',
        marginTop: -4,
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    searchContainer: {
        flex: 1,
    },
    currentLocationButton: {
        position: 'absolute',
        right: 16,
        bottom: 200,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    bottomCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    loadingAddress: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
    },
    loadingText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#666',
    },
    addressContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    addressIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#FFEBEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    addressContent: {
        flex: 1,
    },
    addressLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
        lineHeight: 20,
    },
    noAddressText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        paddingVertical: 20,
    },
    confirmButton: {
        backgroundColor: '#E23744',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    confirmButtonDisabled: {
        opacity: 0.7,
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default SelectLocationMapScreen;
