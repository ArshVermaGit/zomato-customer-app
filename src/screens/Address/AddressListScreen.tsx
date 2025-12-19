/**
 * AddressListScreen
 * Displays list of saved addresses with edit, delete, and select options
 */

import React, { useState, useCallback } from 'react';
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
import { colors, spacing, typography, borderRadius, shadows } from '@zomato/design-tokens';

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
                        <ArrowLeft size={24} color={colors.secondary.gray_900} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {selectMode ? 'Select Delivery Address' : 'Saved Addresses'}
                    </Text>
                    <View style={styles.headerRight} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary.zomato_red} />
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
                    <ArrowLeft size={24} color={colors.secondary.gray_900} />
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
                        colors={[colors.primary.zomato_red]}
                        tintColor={colors.primary.zomato_red}
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
                        <Plus size={20} color={colors.primary.zomato_red} />
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
        backgroundColor: '#F5F6F8', // Standard List BG
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        backgroundColor: colors.secondary.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.gray_100,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        ...typography.h4,
        color: colors.secondary.gray_900,
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
        padding: spacing.md,
        marginHorizontal: spacing.md,
        marginTop: spacing.md,
        borderRadius: borderRadius.md,
    },
    errorText: {
        color: colors.primary.zomato_red,
        fontSize: 14,
        textAlign: 'center',
    },
    listContent: {
        padding: spacing.md,
        paddingBottom: 100,
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
        marginBottom: spacing.lg,
    },
    emptyTitle: {
        ...typography.h3,
        color: colors.secondary.gray_900,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    emptySubtitle: {
        ...typography.body_medium,
        color: colors.secondary.gray_600,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary.zomato_red,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        ...shadows.md,
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
        lineHeight: 24,
        color: colors.secondary.white,
        marginLeft: spacing.sm,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.secondary.white,
        padding: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.secondary.gray_100,
    },
    addNewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.secondary.white,
        borderWidth: 1,
        borderColor: colors.primary.zomato_red,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
    },
    addNewButtonText: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
        lineHeight: 24,
        color: colors.primary.zomato_red,
        marginLeft: spacing.sm,
    },
});

export default AddressListScreen;
