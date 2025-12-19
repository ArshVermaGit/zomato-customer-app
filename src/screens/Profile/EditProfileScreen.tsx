/**
 * Edit Profile Screen
 * Update user details
 */

import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Camera, ChevronLeft } from 'lucide-react-native';

import { RootState, AppDispatch } from '../../store/store';
import { updateProfile } from '../../store/slices/authSlice';
import { colors, spacing, typography, borderRadius } from '@zomato/design-tokens';

const EditProfileScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const { user, isLoading } = useSelector((state: RootState) => state.auth);

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }

        try {
            await dispatch(updateProfile({ name, email })).unwrap();
            Alert.alert('Success', 'Profile updated successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color={colors.secondary.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} disabled={isLoading}>
                    <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={user?.avatar ? { uri: user.avatar } : require('../../assets/images/placeholder_avatar.png')} // Fallback if local asset missing use uri
                            defaultSource={{ uri: 'https://via.placeholder.com/150' }}
                            style={styles.avatar}
                        />
                        <TouchableOpacity style={styles.cameraButton}>
                            <Camera size={20} color={colors.secondary.white} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Enter your name"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <View style={[styles.input, styles.disabledInput]}>
                            <Text style={styles.disabledText}>{user?.phone}</Text>
                        </View>
                        <Text style={styles.helperText}>Phone number cannot be changed</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.white,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.base,
        borderBottomWidth: 1,
        borderBottomColor: colors.secondary.gray_100,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        ...typography.h3,
        color: colors.secondary.gray_900,
    },
    saveText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary.zomato_red,
    },
    content: {
        padding: spacing.xl,
    },
    avatarContainer: {
        alignSelf: 'center',
        marginBottom: spacing.xl,
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.secondary.gray_100,
    },
    cameraButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary.zomato_red,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: colors.secondary.white,
    },
    formGroup: {
        marginBottom: spacing.xl,
    },
    label: {
        ...typography.label_medium,
        color: colors.secondary.gray_600,
        marginBottom: spacing.sm,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.secondary.gray_200,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        fontSize: 16,
        color: colors.secondary.gray_900,
        backgroundColor: colors.secondary.white,
    },
    disabledInput: {
        backgroundColor: colors.secondary.gray_50,
        borderColor: colors.secondary.gray_100,
    },
    disabledText: {
        color: colors.secondary.gray_400,
    },
    helperText: {
        ...typography.caption,
        color: colors.secondary.gray_500,
        marginTop: spacing.xs,
    },
});

export default EditProfileScreen;
