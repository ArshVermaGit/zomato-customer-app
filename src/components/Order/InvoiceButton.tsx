/**
 * Invoice Button Component
 * Simulates invoice download
 */

import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Download } from 'lucide-react-native';

const InvoiceButton = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = () => {
        setIsLoading(true);
        // Simulate download delay
        setTimeout(() => {
            setIsLoading(false);
            Alert.alert('Success', 'Invoice downloaded successfully to your device.');
        }, 1500);
    };

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={handleDownload}
            disabled={isLoading}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color="#E23744" />
            ) : (
                <>
                    <Download size={16} color="#E23744" />
                    <Text style={styles.text}>Download Invoice</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#E23744',
        borderRadius: 8,
        backgroundColor: '#FFF0F3',
        gap: 8,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        color: '#E23744',
    }
});

export default InvoiceButton;
