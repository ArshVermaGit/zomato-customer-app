import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RestaurantCard from '../RestaurantCard';

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
}));

const mockRestaurant = {
    id: '123',
    name: 'Test Restaurant',
    image: 'https://example.com/image.jpg',
    rating: 4.5,
    cuisine: 'Italian',
    deliveryTime: '30-40 min',
    priceForTwo: '$20 for two',
    offer: '50% OFF',
};

describe('RestaurantCard', () => {
    it('renders restaurant details correctly', () => {
        const useNavigation = require('@react-navigation/native').useNavigation;
        useNavigation.mockReturnValue({ navigate: jest.fn() });

        const { getByText } = render(<RestaurantCard restaurant={mockRestaurant} />);

        expect(getByText('Test Restaurant')).toBeTruthy();
        expect(getByText('Italian')).toBeTruthy();
        expect(getByText('4.5')).toBeTruthy();
        expect(getByText('30-40 min')).toBeTruthy();
        expect(getByText('$20 for two')).toBeTruthy();
        expect(getByText('50% OFF')).toBeTruthy();
    });

    it('navigates to details screen on press', () => {
        const navigate = jest.fn();
        const useNavigation = require('@react-navigation/native').useNavigation;
        useNavigation.mockReturnValue({ navigate });

        const { getByText } = render(<RestaurantCard restaurant={mockRestaurant} />);

        fireEvent.press(getByText('Test Restaurant'));

        expect(navigate).toHaveBeenCalledWith('RestaurantDetail', { id: '123' });
    });
});
