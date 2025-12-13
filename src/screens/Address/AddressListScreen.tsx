/**
 * AddressListScreen
 * Displays list of saved addresses with edit, delete, and select options
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, Plus } from 'lucide-react-native';
import type { RootState, AppDispatch } from '../../store/store';
import type { Address, AddressStackParamList } from '../../types/address.types';
import { fetchAddresses, deleteAddress, setSelectedAddress } from '../../store/slices/addressSlice';
import { AddressCard, DeleteConfirmationModal } from '../../components/Address';

type NavigationProp = StackNavigationProp<AddressStackParamList, 'AddressList'>;
type RouteProps = RouteProp<AddressStackParamList, 'AddressList'>;

const AddressListScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const dispatch = useDispatch<AppDispatch>();

    const { addresses, selectedAddress, isLoading, error } = useSelector(
        (state: RootState) => state.address
    );

    const selectMode = route.params?.selectMode ?? false;

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            dispatch(fetchAddresses());
        }, [dispatch])
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await dispatch(fetchAddresses());
        setRefreshing(false);
    }, [dispatch]);

    const handleAddAddress = () => {
        navigation.navigate('AddAddress');
    };

    const handleEditAddress = (address: Address) => {
        navigation.navigate('EditAddress', { addressId: address.id });
    };

    const handleDeletePress = (address: Address) => {
        setAddressToDelete(address);
        setDeleteModalVisible(true);
    };

    const handleDeleteConfirm = async () => {
        if (!addressToDelete) return;

        setIsDeleting(true);
        try {
            await dispatch(deleteAddress(addressToDelete.id)).unwrap();
            setDeleteModalVisible(false);
            setAddressToDelete(null);
        } catch (err) {
            console.error('Failed to delete address:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSelectAddress = (address: Address) => {
        dispatch(setSelectedAddress(address));
        if (route.params?.returnTo) {
            navigation.goBack();
        }
    };

    const renderAddress = ({ item }: { item: Address }) => (
        <AddressCard
            address={item}
            isSelected={selectedAddress?.id === item.id}
            showSelectButton={selectMode}
            onSelect={handleSelectAddress}
            onEdit={handleEditAddress}
            onDelete={handleDeletePress}
        />
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Image
                source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/9830/9830564.png',
                }}
                style={styles.emptyImage}
                resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>No saved addresses</Text>
            <Text style={styles.emptySubtitle}>
                Add your first address to get started with seamless food delivery
            </Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
                <Plus size={20} color="#fff" />
                <Text style={styles.addButtonText}>Add New Address</Text>
            </TouchableOpacity>
        </View>
    );

    if (isLoading && addresses.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <ArrowLeft size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {selectMode ? 'Select Delivery Address' : 'Saved Addresses'}
                    </Text>
                    <View style={styles.headerRight} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#E23744" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <ArrowLeft size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {selectMode ? 'Select Delivery Address' : 'Saved Addresses'}
                </Text>
                <View style={styles.headerRight} />
            </View>

            {error && (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <FlatList
                data={addresses}
                renderItem={renderAddress}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[
                    styles.listContent,
                    addresses.length === 0 && styles.emptyListContent,
                ]}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#E23744']}
                        tintColor="#E23744"
                    />
                }
                showsVerticalScrollIndicator={false}
            />

            {addresses.length > 0 && (
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.addNewButton}
                        onPress={handleAddAddress}
                    >
                        <Plus size={20} color="#E23744" />
                        <Text style={styles.addNewButtonText}>Add New Address</Text>
                    </TouchableOpacity>
                </View>
            )}

            <DeleteConfirmationModal
                visible={deleteModalVisible}
                title="Delete Address"
                message={`Are you sure you want to delete "${addressToDelete?.label || 'this'}" address?`}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteModalVisible(false)}
                isLoading={isDeleting}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F6F8',
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorBanner: {
        backgroundColor: '#FFEBEE',
        padding: 12,
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 8,
    },
    errorText: {
        color: '#E23744',
        fontSize: 14,
        textAlign: 'center',
    },
    listContent: {
        padding: 16,
    },
    emptyListContent: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyImage: {
        width: 180,
        height: 180,
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E23744',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 10,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 8,
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
    addNewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E23744',
        paddingVertical: 14,
        borderRadius: 10,
    },
    addNewButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#E23744',
        marginLeft: 8,
    },
});

export default AddressListScreen;
