// Web mock for react-native-maps
// Maps are not supported on web, this provides a fallback

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MapView = ({ children, style, ...props }) => (
    <View style={[styles.container, style]} {...props}>
        <Text style={styles.text}>Map View (Web Preview)</Text>
        {children}
    </View>
);

const Marker = ({ children, ...props }) => (
    <View {...props}>{children}</View>
);

const Callout = ({ children, ...props }) => (
    <View {...props}>{children}</View>
);

const Polygon = (props) => null;
const Polyline = (props) => null;
const Circle = (props) => null;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
    },
    text: {
        color: '#666',
        fontSize: 16,
    },
});

export default MapView;
export { Marker, Callout, Polygon, Polyline, Circle };
export const PROVIDER_GOOGLE = 'google';
export const PROVIDER_DEFAULT = null;
