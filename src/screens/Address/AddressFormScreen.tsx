/**
 * AddressFormScreen
 * Form for entering address details after selecting location
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Switch,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, MapPin, ChevronRight } from 'lucide-react-native';
import type { AddressStackParamList, AddressLabel, DeliveryAreaInfo } from '../../types/address.types';
import { AddressLabel as AddressLabelEnum } from '../../types/address.types';
import type { RootState, AppDispatch } from '../../store/store';
import { addAddress, updateAddress } from '../../store/slices/addressSlice';
import { AddressService } from '../../services/address.service';
import { AddressLabelChip, DeliveryAreaBadge, MapPreview } from '../../components/Address';

type NavigationProp = StackNavigationProp<AddressStackParamList, 'AddressForm'>;
type RouteProps = RouteProp<AddressStackParamList, 'AddressForm'>;

const AddressFormScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const dispatch = useDispatch<AppDispatch>();
    const { } = useSelector((state: RootState) => state.address);

    const {
        latitude,
        longitude,
        formattedAddress,
        city,
        state,
        postalCode,
        country,
        street,
        editAddressId,
    } = route.params;

    // Form state
    const [houseNumber, setHouseNumber] = useState('');
    const [buildingName, setBuildingName] = useState('');
    const [landmark, setLandmark] = useState('');
    const [label, setLabel] = useState<AddressLabel>(AddressLabelEnum.HOME);
    const [customLabel, setCustomLabel] = useState('');
    const [isDefault, setIsDefault] = useState(false);

    // Delivery area state
    const [deliveryInfo, setDeliveryInfo] = useState<DeliveryAreaInfo | null>(null);
    const [isCheckingDelivery, setIsCheckingDelivery] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Check delivery area on mount
    useEffect(() => {
        const checkDelivery = async () => {
            setIsCheckingDelivery(true);
            try {
                const info = await AddressService.checkDeliveryArea(latitude, longitude);
                setDeliveryInfo(info);
            } catch (error) {
                console.error('Failed to check delivery area:', error);
            } finally {
                setIsCheckingDelivery(false);
            }
        };
        checkDelivery();
    }, [latitude, longitude]);

    const handleChangeLocation = () => {
        navigation.navigate('SelectLocationMap', {
            initialLatitude: latitude,
            initialLongitude: longitude,
            editAddressId,
        });
    };

    const isFormValid = () => {
        return (
            houseNumber.trim().length > 0 &&
            deliveryInfo?.isDeliverable === true &&
            (label !== AddressLabelEnum.OTHER || customLabel.trim().length > 0)
        );
    };

    const handleSaveAddress = async () => {
        if (!isFormValid()) return;

        setIsSaving(true);
        try {
            const addressData = {
                label,
                customLabel: label === AddressLabelEnum.OTHER ? customLabel : undefined,
                latitude,
                longitude,
                houseNumber: houseNumber.trim(),
                buildingName: buildingName.trim() || undefined,
                landmark: landmark.trim() || undefined,
                formattedAddress,
                street,
                city,
                state,
                postalCode,
                country,
                isDefault,
            };

            if (editAddressId) {
                await dispatch(updateAddress({ id: editAddressId, ...addressData })).unwrap();
            } else {
                await dispatch(addAddress(addressData)).unwrap();
            }

            // Navigate back to list
            navigation.navigate('AddressList', {});
        } catch (error) {
            console.error('Failed to save address:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <ArrowLeft size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {editAddressId ? 'Edit Address' : 'Add Address Details'}
                    </Text>
                    <View style={styles.headerRight} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Map Preview */}
                    <TouchableOpacity
                        style={styles.mapPreviewContainer}
                        onPress={handleChangeLocation}
                        activeOpacity={0.8}
                    >
                        <MapPreview latitude={latitude} longitude={longitude} height={120} />
                        <View style={styles.changeLocationOverlay}>
                            <View style={styles.changeLocationButton}>
                                <MapPin size={14} color="#E23744" />
                                <Text style={styles.changeLocationText}>Change</Text>
                                <ChevronRight size={14} color="#E23744" />
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Current Address Display */}
                    <View style={styles.currentAddressCard}>
                        <MapPin size={18} color="#E23744" />
                        <Text style={styles.currentAddressText} numberOfLines={2}>
                            {formattedAddress}
                        </Text>
                    </View>

                    {/* Delivery Area Badge */}
                    <DeliveryAreaBadge
                        deliveryInfo={deliveryInfo}
                        isLoading={isCheckingDelivery}
                    />

                    {/* Form Fields */}
                    <View style={styles.formSection}>
                        <Text style={styles.inputLabel}>House / Flat / Floor No. *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., 42, 3rd Floor"
                            placeholderTextColor="#999"
                            value={houseNumber}
                            onChangeText={setHouseNumber}
                        />

                        <Text style={styles.inputLabel}>Tower / Building Name (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Sunrise Apartments"
                            placeholderTextColor="#999"
                            value={buildingName}
                            onChangeText={setBuildingName}
                        />

                        <Text style={styles.inputLabel}>Landmark (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Near Central Park"
                            placeholderTextColor="#999"
                            value={landmark}
                            onChangeText={setLandmark}
                        />
                    </View>

                    {/* Address Label Chips */}
                    <AddressLabelChip selected={label} onSelect={setLabel} />

                    {/* Custom Label Input */}
                    {label === AddressLabelEnum.OTHER && (
                        <View style={styles.customLabelContainer}>
                            <Text style={styles.inputLabel}>Custom Label *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., Gym, Friend's Place"
                                placeholderTextColor="#999"
                                value={customLabel}
                                onChangeText={setCustomLabel}
                            />
                        </View>
                    )}

                    {/* Default Toggle */}
                    <View style={styles.defaultToggleContainer}>
                        <View style={styles.defaultToggleText}>
                            <Text style={styles.defaultToggleTitle}>
                                Make this my default address
                            </Text>
                            <Text style={styles.defaultToggleSubtitle}>
                                This address will be selected automatically for new orders
                            </Text>
                        </View>
                        <Switch
                            value={isDefault}
                            onValueChange={setIsDefault}
                            trackColor={{ false: '#E0E0E0', true: '#FFCDD2' }}
                            thumbColor={isDefault ? '#E23744' : '#fff'}
                        />
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>

                {/* Save Button */}
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={[
                            styles.saveButton,
                            (!isFormValid() || isSaving) && styles.saveButtonDisabled,
                        ]}
                        onPress={handleSaveAddress}
                        disabled={!isFormValid() || isSaving}
                    >
                        {isSaving ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.saveButtonText}>
                                {editAddressId ? 'Update Address' : 'Save Address'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6F8',
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    mapPreviewContainer: {
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 12,
    },
    changeLocationOverlay: {
        position: 'absolute',
        bottom: 8,
        right: 8,
    },
    changeLocationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },
    changeLocationText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#E23744',
        marginHorizontal: 4,
    },
    currentAddressCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 10,
    },
    currentAddressText: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        marginLeft: 10,
        lineHeight: 20,
    },
    formSection: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#666',
        marginBottom: 8,
        marginTop: 12,
    },
    input: {
        backgroundColor: '#F5F6F8',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#333',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    customLabelContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    defaultToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },
    defaultToggleText: {
        flex: 1,
        marginRight: 16,
    },
    defaultToggleTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    defaultToggleSubtitle: {
        fontSize: 12,
        color: '#666',
    },
    footer: {
        backgroundColor: '#fff',
        padding: 16,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    saveButton: {
        backgroundColor: '#E23744',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default AddressFormScreen;
