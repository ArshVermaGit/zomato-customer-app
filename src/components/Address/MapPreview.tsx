/**
 * MapPreview Component
 * Small non-interactive map preview for address form
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MapPin } from 'lucide-react-native';

interface MapPreviewProps {
    latitude: number;
    longitude: number;
    height?: number;
}

const MapPreview: React.FC<MapPreviewProps> = ({
    latitude,
    longitude,
    height = 150,
}) => {
    return (
        <View style={[styles.container, { height }]}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                region={{
                    latitude,
                    longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
            >
                <Marker coordinate={{ latitude, longitude }}>
                    <View style={styles.markerContainer}>
                        <View style={styles.markerPin}>
                            <MapPin size={20} color="#fff" />
                        </View>
                        <View style={styles.markerShadow} />
                    </View>
                </Marker>
            </MapView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#F5F6F8',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    markerContainer: {
        alignItems: 'center',
    },
    markerPin: {
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
    markerShadow: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(0,0,0,0.15)',
        marginTop: -2,
    },
});

export default MapPreview;
