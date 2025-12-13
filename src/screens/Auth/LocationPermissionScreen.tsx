import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'LocationPermission'>;

const LocationPermissionScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    const handleEnableLocation = () => {
        // Logic to request specific location permission
        // For now navigation to mock Home
        console.log('Requesting permission...');
        // navigation.replace('MainApp'); // To be implemented
    };

    const handleManualLocation = () => {
        // navigation.navigate('LocationSearch');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Image
                    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/854/854878.png' }}
                    style={styles.image}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Allow Location Access</Text>
                <Text style={styles.description}>
                    We need your location to show you the best restaurants and food nearby.
                </Text>

                <TouchableOpacity style={styles.button} onPress={handleEnableLocation}>
                    <Text style={styles.buttonText}>Allow Location Access</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleManualLocation}>
                    <Text style={styles.manualText}>Enter Location Manually</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 30,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    button: {
        backgroundColor: '#E23744',
        width: '100%',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    manualText: {
        color: '#E23744',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default LocationPermissionScreen;
