/**
 * Address Service
 * Mock API service for address management, geocoding, and delivery area validation
 */

import type {
    Address,
    CreateAddressRequest,
    UpdateAddressRequest,
    GeocodingResult,
    ReverseGeocodingResult,
    DeliveryAreaInfo,
    LocationSuggestion,
    AddressLabel,
} from '../types/address.types';

// Mock delay to simulate API
const mockDelay = (ms: number = 800) => new Promise<void>(resolve => setTimeout(resolve, ms));

// Mock addresses data
let mockAddresses: Address[] = [
    {
        id: '1',
        userId: 'user1',
        label: 'home' as AddressLabel,
        latitude: 28.6139,
        longitude: 77.2090,
        houseNumber: '42',
        buildingName: 'Sunrise Apartments',
        landmark: 'Near Central Park',
        formattedAddress: '42, Sunrise Apartments, Connaught Place, New Delhi, Delhi 110001',
        street: 'Connaught Place',
        city: 'New Delhi',
        state: 'Delhi',
        postalCode: '110001',
        country: 'India',
        isDefault: true,
        isDeliverable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: '2',
        userId: 'user1',
        label: 'work' as AddressLabel,
        latitude: 28.4595,
        longitude: 77.0266,
        houseNumber: '301',
        buildingName: 'Tech Park Tower',
        landmark: 'Opposite Metro Station',
        formattedAddress: '301, Tech Park Tower, Sector 44, Gurugram, Haryana 122003',
        street: 'Sector 44',
        city: 'Gurugram',
        state: 'Haryana',
        postalCode: '122003',
        country: 'India',
        isDefault: false,
        isDeliverable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

// Mock location suggestions
const mockSuggestions: LocationSuggestion[] = [
    {
        placeId: 'place1',
        mainText: 'Connaught Place',
        secondaryText: 'New Delhi, Delhi, India',
        fullDescription: 'Connaught Place, New Delhi, Delhi 110001, India',
    },
    {
        placeId: 'place2',
        mainText: 'India Gate',
        secondaryText: 'New Delhi, Delhi, India',
        fullDescription: 'India Gate, Rajpath, New Delhi, Delhi 110001, India',
    },
    {
        placeId: 'place3',
        mainText: 'Hauz Khas Village',
        secondaryText: 'New Delhi, Delhi, India',
        fullDescription: 'Hauz Khas Village, Hauz Khas, New Delhi, Delhi 110016, India',
    },
    {
        placeId: 'place4',
        mainText: 'Saket',
        secondaryText: 'New Delhi, Delhi, India',
        fullDescription: 'Saket, New Delhi, Delhi 110017, India',
    },
    {
        placeId: 'place5',
        mainText: 'Cyber Hub',
        secondaryText: 'Gurugram, Haryana, India',
        fullDescription: 'Cyber Hub, DLF Cyber City, Gurugram, Haryana 122002, India',
    },
];

export const AddressService = {
    /**
     * Get user's saved addresses
     * GET /users/addresses
     */
    getUserAddresses: async (): Promise<Address[]> => {
        await mockDelay();
        return [...mockAddresses];
    },

    /**
     * Add a new address
     * POST /users/addresses
     */
    addAddress: async (request: CreateAddressRequest): Promise<Address> => {
        await mockDelay();

        const newAddress: Address = {
            ...request,
            id: `addr_${Date.now()}`,
            userId: 'user1',
            isDeliverable: true, // Would be validated server-side
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // If set as default, update other addresses
        if (request.isDefault) {
            mockAddresses = mockAddresses.map(addr => ({
                ...addr,
                isDefault: false,
            }));
        }

        mockAddresses.push(newAddress);
        return newAddress;
    },

    /**
     * Update an existing address
     * PUT /users/addresses/:id
     */
    updateAddress: async (request: UpdateAddressRequest): Promise<Address> => {
        await mockDelay();

        const index = mockAddresses.findIndex(addr => addr.id === request.id);
        if (index === -1) {
            throw new Error('Address not found');
        }

        // If set as default, update other addresses
        if (request.isDefault) {
            mockAddresses = mockAddresses.map(addr => ({
                ...addr,
                isDefault: false,
            }));
        }

        const updatedAddress: Address = {
            ...mockAddresses[index],
            ...request,
            updatedAt: new Date().toISOString(),
        };

        mockAddresses[index] = updatedAddress;
        return updatedAddress;
    },

    /**
     * Delete an address
     * DELETE /users/addresses/:id
     */
    deleteAddress: async (id: string): Promise<void> => {
        await mockDelay();

        const index = mockAddresses.findIndex(addr => addr.id === id);
        if (index === -1) {
            throw new Error('Address not found');
        }

        mockAddresses.splice(index, 1);
    },

    /**
     * Forward geocoding - convert address to coordinates
     * POST /maps/geocode
     */
    geocodeAddress: async (query: string): Promise<GeocodingResult | null> => {
        await mockDelay(500);

        // Mock geocoding result
        if (query.toLowerCase().includes('connaught')) {
            return {
                placeId: 'place1',
                formattedAddress: 'Connaught Place, New Delhi, Delhi 110001, India',
                latitude: 28.6139,
                longitude: 77.2090,
                street: 'Connaught Place',
                city: 'New Delhi',
                state: 'Delhi',
                postalCode: '110001',
                country: 'India',
            };
        }

        // Default mock result
        return {
            placeId: 'mock_place',
            formattedAddress: query,
            latitude: 28.6139 + (Math.random() - 0.5) * 0.1,
            longitude: 77.2090 + (Math.random() - 0.5) * 0.1,
            city: 'New Delhi',
            state: 'Delhi',
            postalCode: '110001',
            country: 'India',
        };
    },

    /**
     * Reverse geocoding - convert coordinates to address
     * POST /maps/reverse-geocode
     */
    reverseGeocode: async (latitude: number, longitude: number): Promise<ReverseGeocodingResult> => {
        await mockDelay(500);

        // Mock reverse geocoding based on approximate location
        const isDelhi = latitude > 28.4 && latitude < 28.9 && longitude > 76.8 && longitude < 77.5;
        const isGurgaon = latitude > 28.3 && latitude < 28.6 && longitude > 76.9 && longitude < 77.2;

        if (isGurgaon) {
            return {
                formattedAddress: 'Sector 44, Gurugram, Haryana 122003, India',
                street: 'Sector 44',
                city: 'Gurugram',
                state: 'Haryana',
                postalCode: '122003',
                country: 'India',
            };
        }

        if (isDelhi) {
            return {
                formattedAddress: 'Connaught Place, New Delhi, Delhi 110001, India',
                street: 'Connaught Place',
                city: 'New Delhi',
                state: 'Delhi',
                postalCode: '110001',
                country: 'India',
            };
        }

        return {
            formattedAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            city: 'Unknown',
            state: 'Unknown',
            postalCode: '',
            country: 'India',
        };
    },

    /**
     * Check if location is within delivery area
     */
    checkDeliveryArea: async (latitude: number, longitude: number): Promise<DeliveryAreaInfo> => {
        await mockDelay(300);

        // Mock delivery area check - deliverable in Delhi NCR region
        const isDeliverable =
            latitude > 28.3 && latitude < 28.9 &&
            longitude > 76.8 && longitude < 77.5;

        if (isDeliverable) {
            return {
                isDeliverable: true,
                estimatedDeliveryTime: '25-35 min',
                deliveryFee: 30,
            };
        }

        return {
            isDeliverable: false,
            message: "We don't deliver here yet. Please select a different location.",
        };
    },

    /**
     * Search location suggestions for autocomplete
     */
    searchLocations: async (query: string): Promise<LocationSuggestion[]> => {
        await mockDelay(300);

        if (!query.trim()) {
            return [];
        }

        const lowercaseQuery = query.toLowerCase();
        return mockSuggestions.filter(
            suggestion =>
                suggestion.mainText.toLowerCase().includes(lowercaseQuery) ||
                suggestion.secondaryText.toLowerCase().includes(lowercaseQuery)
        );
    },

    /**
     * Get place details from place ID
     */
    getPlaceDetails: async (placeId: string): Promise<GeocodingResult | null> => {
        await mockDelay(300);

        const suggestion = mockSuggestions.find(s => s.placeId === placeId);
        if (!suggestion) return null;

        // Return mock coordinates based on place
        const mockCoords: Record<string, { lat: number; lng: number }> = {
            place1: { lat: 28.6139, lng: 77.2090 },
            place2: { lat: 28.6129, lng: 77.2295 },
            place3: { lat: 28.5494, lng: 77.2001 },
            place4: { lat: 28.5245, lng: 77.2066 },
            place5: { lat: 28.4946, lng: 77.0887 },
        };

        const coords = mockCoords[placeId] || { lat: 28.6139, lng: 77.2090 };

        return {
            placeId,
            formattedAddress: suggestion.fullDescription,
            latitude: coords.lat,
            longitude: coords.lng,
            city: suggestion.secondaryText.split(',')[0].trim(),
            state: suggestion.secondaryText.includes('Delhi') ? 'Delhi' : 'Haryana',
            postalCode: '110001',
            country: 'India',
        };
    },

    /**
     * Set address as default
     */
    setDefaultAddress: async (addressId: string): Promise<void> => {
        await mockDelay();

        mockAddresses = mockAddresses.map(addr => ({
            ...addr,
            isDefault: addr.id === addressId,
        }));
    },
};
