/**
 * Address Management Types
 * Types for address management, geocoding, and delivery area validation
 */

// Address label enum
export enum AddressLabel {
    HOME = 'home',
    WORK = 'work',
    OTHER = 'other',
}

// Address label display info
export const AddressLabelInfo: Record<AddressLabel, { icon: string; displayName: string }> = {
    [AddressLabel.HOME]: { icon: 'Home', displayName: 'Home' },
    [AddressLabel.WORK]: { icon: 'Briefcase', displayName: 'Work' },
    [AddressLabel.OTHER]: { icon: 'MapPin', displayName: 'Other' },
};

// Core address interface
export interface Address {
    id: string;
    userId: string;
    label: AddressLabel;
    customLabel?: string; // For "Other" label type

    // Location coordinates
    latitude: number;
    longitude: number;

    // Address components
    houseNumber: string;        // House/Flat/Floor No.
    buildingName?: string;      // Tower/Building name
    landmark?: string;          // Landmark

    // Full address from geocoding
    formattedAddress: string;
    street?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;

    // Flags
    isDefault: boolean;
    isDeliverable: boolean;

    // Timestamps
    createdAt: string;
    updatedAt: string;
}

// Create address request payload
export interface CreateAddressRequest {
    label: AddressLabel;
    customLabel?: string;
    latitude: number;
    longitude: number;
    houseNumber: string;
    buildingName?: string;
    landmark?: string;
    formattedAddress: string;
    street?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

// Update address request payload
export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {
    id: string;
}

// Geocoding result from forward geocoding
export interface GeocodingResult {
    placeId: string;
    formattedAddress: string;
    latitude: number;
    longitude: number;
    street?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

// Reverse geocoding result
export interface ReverseGeocodingResult {
    formattedAddress: string;
    street?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

// Delivery area info
export interface DeliveryAreaInfo {
    isDeliverable: boolean;
    estimatedDeliveryTime?: string; // e.g., "25-30 min"
    deliveryFee?: number;
    message?: string; // e.g., "We don't deliver here yet"
}

// Location suggestion for autocomplete
export interface LocationSuggestion {
    placeId: string;
    mainText: string;      // e.g., "Connaught Place"
    secondaryText: string; // e.g., "New Delhi, Delhi, India"
    fullDescription: string;
}

// Address state for Redux
export interface AddressState {
    addresses: Address[];
    selectedAddress: Address | null;
    defaultAddressId: string | null;
    isLoading: boolean;
    error: string | null;
}

// Navigation params for address screens
export type AddressStackParamList = {
    AddressList: { selectMode?: boolean; returnTo?: string };
    AddAddress: undefined;
    SelectLocationMap: {
        initialLatitude?: number;
        initialLongitude?: number;
        editAddressId?: string;
    };
    AddressForm: {
        latitude: number;
        longitude: number;
        formattedAddress: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
        street?: string;
        editAddressId?: string;
    };
    EditAddress: { addressId: string };
};
