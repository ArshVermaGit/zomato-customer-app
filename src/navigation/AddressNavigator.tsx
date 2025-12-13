/**
 * AddressNavigator
 * Stack navigator for address management flow
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import type { AddressStackParamList } from '../types/address.types';
import {
    AddressListScreen,
    AddAddressScreen,
    SelectLocationMapScreen,
    AddressFormScreen,
    EditAddressScreen,
} from '../screens/Address';

const Stack = createStackNavigator<AddressStackParamList>();

const AddressNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="AddressList" component={AddressListScreen} />
            <Stack.Screen name="AddAddress" component={AddAddressScreen} />
            <Stack.Screen name="SelectLocationMap" component={SelectLocationMapScreen} />
            <Stack.Screen name="AddressForm" component={AddressFormScreen} />
            <Stack.Screen name="EditAddress" component={EditAddressScreen} />
        </Stack.Navigator>
    );
};

export default AddressNavigator;
