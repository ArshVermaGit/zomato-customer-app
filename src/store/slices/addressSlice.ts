/**
 * Address Slice
 * Redux slice for managing user addresses
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Address, AddressState, CreateAddressRequest, UpdateAddressRequest } from '../../types/address.types';
import { AddressService } from '../../services/address.service';

const initialState: AddressState = {
    addresses: [],
    selectedAddress: null,
    defaultAddressId: null,
    isLoading: false,
    error: null,
};

// Async thunks
export const fetchAddresses = createAsyncThunk(
    'address/fetchAddresses',
    async (_, { rejectWithValue }) => {
        try {
            const addresses = await AddressService.getUserAddresses();
            return addresses;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const addAddress = createAsyncThunk(
    'address/addAddress',
    async (request: CreateAddressRequest, { rejectWithValue }) => {
        try {
            const newAddress = await AddressService.addAddress(request);
            return newAddress;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const updateAddress = createAsyncThunk(
    'address/updateAddress',
    async (request: UpdateAddressRequest, { rejectWithValue }) => {
        try {
            const updatedAddress = await AddressService.updateAddress(request);
            return updatedAddress;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const deleteAddress = createAsyncThunk(
    'address/deleteAddress',
    async (addressId: string, { rejectWithValue }) => {
        try {
            await AddressService.deleteAddress(addressId);
            return addressId;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const setDefaultAddressAsync = createAsyncThunk(
    'address/setDefaultAddress',
    async (addressId: string, { rejectWithValue }) => {
        try {
            await AddressService.setDefaultAddress(addressId);
            return addressId;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        setSelectedAddress: (state, action: PayloadAction<Address | null>) => {
            state.selectedAddress = action.payload;
        },
        clearAddressError: (state) => {
            state.error = null;
        },
        resetAddressState: () => initialState,
    },
    extraReducers: (builder) => {
        // Fetch addresses
        builder
            .addCase(fetchAddresses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.addresses = action.payload;
                // Set default address
                const defaultAddr = action.payload.find(addr => addr.isDefault);
                state.defaultAddressId = defaultAddr?.id || null;
                // Set selected address to default if not set
                if (!state.selectedAddress && defaultAddr) {
                    state.selectedAddress = defaultAddr;
                }
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Add address
        builder
            .addCase(addAddress.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.addresses.push(action.payload);
                // Update default if this is the new default
                if (action.payload.isDefault) {
                    state.defaultAddressId = action.payload.id;
                    state.addresses = state.addresses.map(addr => ({
                        ...addr,
                        isDefault: addr.id === action.payload.id,
                    }));
                }
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Update address
        builder
            .addCase(updateAddress.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
                if (index !== -1) {
                    state.addresses[index] = action.payload;
                }
                // Update default if needed
                if (action.payload.isDefault) {
                    state.defaultAddressId = action.payload.id;
                    state.addresses = state.addresses.map(addr => ({
                        ...addr,
                        isDefault: addr.id === action.payload.id,
                    }));
                }
                // Update selected address if it was the one updated
                if (state.selectedAddress?.id === action.payload.id) {
                    state.selectedAddress = action.payload;
                }
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Delete address
        builder
            .addCase(deleteAddress.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.isLoading = false;
                state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
                // Clear selected if it was deleted
                if (state.selectedAddress?.id === action.payload) {
                    state.selectedAddress = null;
                }
                // Clear default if it was deleted
                if (state.defaultAddressId === action.payload) {
                    state.defaultAddressId = null;
                }
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Set default address
        builder
            .addCase(setDefaultAddressAsync.fulfilled, (state, action) => {
                state.defaultAddressId = action.payload;
                state.addresses = state.addresses.map(addr => ({
                    ...addr,
                    isDefault: addr.id === action.payload,
                }));
            });
    },
});

export const { setSelectedAddress, clearAddressError, resetAddressState } = addressSlice.actions;
export default addressSlice.reducer;
