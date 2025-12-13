/**
 * LiveDeliveryMap Component
 * Real-time map showing delivery partner, restaurant, and customer locations
 */

import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { MapPin, Navigation, Home } from 'lucide-react-native';
import type { Order, DeliveryLocationUpdate } from '../../types/order.types';

interface LiveDeliveryMapProps {
    order: Order;
    deliveryLocation: DeliveryLocationUpdate | null;
}

const { width } = Dimensions.get('window');

const LiveDeliveryMap: React.FC<LiveDeliveryMapProps> = ({ order, deliveryLocation }) => {
    const mapRef = useRef<MapView>(null);
    const [route, setRoute] = useState<{ latitude: number; longitude: number }[]>([]);

    // Calculate map region to fit all markers
    const getMapRegion = () => {
        const locations = [
            { latitude: order.restaurant.latitude, longitude: order.restaurant.longitude },
            { latitude: order.customerLatitude, longitude: order.customerLongitude },
        ];

        if (deliveryLocation) {
            locations.push({
                latitude: deliveryLocation.latitude,
                longitude: deliveryLocation.longitude,
            });
        } else if (order.deliveryPartner) {
            locations.push({
                latitude: order.deliveryPartner.latitude,
                longitude: order.deliveryPartner.longitude,
            });
        }

        const lats = locations.map(l => l.latitude);
        const lngs = locations.map(l => l.longitude);

        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        return {
            latitude: (minLat + maxLat) / 2,
            longitude: (minLng + maxLng) / 2,
            latitudeDelta: (maxLat - minLat) * 1.5 + 0.01,
            longitudeDelta: (maxLng - minLng) * 1.5 + 0.01,
        };
    };

    // Update route when delivery location changes
    useEffect(() => {
        if (deliveryLocation) {
            setRoute(prev => [...prev, {
                latitude: deliveryLocation.latitude,
                longitude: deliveryLocation.longitude,
            }]);
        }
    }, [deliveryLocation]);

    // Create simple route line
    const getRouteLine = () => {
        const points = [];

        // Add restaurant
        points.push({
            latitude: order.restaurant.latitude,
            longitude: order.restaurant.longitude,
        });

        // Add delivery partner current location
        if (deliveryLocation) {
            points.push({
                latitude: deliveryLocation.latitude,
                longitude: deliveryLocation.longitude,
            });
        } else if (order.deliveryPartner) {
            points.push({
                latitude: order.deliveryPartner.latitude,
                longitude: order.deliveryPartner.longitude,
            });
        }

        // Add customer
        points.push({
            latitude: order.customerLatitude,
            longitude: order.customerLongitude,
        });

        return points;
    };

    const deliveryPartnerCoords = deliveryLocation
        ? { latitude: deliveryLocation.latitude, longitude: deliveryLocation.longitude }
        : order.deliveryPartner
            ? { latitude: order.deliveryPartner.latitude, longitude: order.deliveryPartner.longitude }
            : null;

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={getMapRegion()}
                showsUserLocation={false}
                showsMyLocationButton={false}
            >
                {/* Route Line */}
                <Polyline
                    coordinates={getRouteLine()}
                    strokeColor="#E23744"
                    strokeWidth={3}
                    lineDashPattern={[10, 5]}
                />

                {/* Restaurant Marker */}
                <Marker
                    coordinate={{
                        latitude: order.restaurant.latitude,
                        longitude: order.restaurant.longitude,
                    }}
                    title={order.restaurant.name}
                >
                    <View style={styles.restaurantMarker}>
                        <MapPin size={18} color="#fff" />
                    </View>
                </Marker>

                {/* Customer Location Marker */}
                <Marker
                    coordinate={{
                        latitude: order.customerLatitude,
                        longitude: order.customerLongitude,
                    }}
                    title="Your Location"
                >
                    <View style={styles.customerMarker}>
                        <Home size={16} color="#fff" />
                    </View>
                </Marker>

                {/* Delivery Partner Marker */}
                {deliveryPartnerCoords && (
                    <Marker
                        coordinate={deliveryPartnerCoords}
                        title={order.deliveryPartner?.name || 'Delivery Partner'}
                    >
                        <View
                            style={[
                                styles.deliveryMarker,
                                deliveryLocation && {
                                    transform: [{ rotate: `${deliveryLocation.heading}deg` }],
                                },
                            ]}
                        >
                            <Navigation size={16} color="#fff" />
                        </View>
                    </Marker>
                )}
            </MapView>

            {/* ETA Overlay */}
            <View style={styles.etaOverlay}>
                <Text style={styles.etaLabel}>Arriving in</Text>
                <Text style={styles.etaTime}>
                    {Math.max(0, Math.floor((new Date(order.estimatedDeliveryTime).getTime() - Date.now()) / 60000))} mins
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 200,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    restaurantMarker: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FF9800',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
    },
    customerMarker: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
    },
    deliveryMarker: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E23744',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
    },
    etaOverlay: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },
    etaLabel: {
        fontSize: 10,
        color: '#666',
    },
    etaTime: {
        fontSize: 16,
        fontWeight: '700',
        color: '#E23744',
    },
});

export default LiveDeliveryMap;
