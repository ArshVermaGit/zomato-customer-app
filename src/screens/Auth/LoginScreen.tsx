import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const schema = z.object({
    phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^[0-9]+$/, 'Invalid phone number'),
});

const LoginScreen = () => {
    const navigation = useNavigation<NavigationProp>();

    const { control, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = (data: { phoneNumber: string }) => {
        // Here you would normally trigger the API call to send OTP
        console.log('Sending OTP to:', data.phoneNumber);
        navigation.navigate('OTPVerification', { phoneNumber: data.phoneNumber, countryCode: '+91' });
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
            <View style={styles.header}>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png' }} style={styles.logo} resizeMode="contain" />
                <Text style={styles.heading}>India's #1 Food Delivery App</Text>
                <View style={styles.divider} />
                <Text style={styles.subHeading}>Log in or sign up</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <View style={styles.countryCode}>
                        <Text style={styles.countryText}>+91</Text>
                    </View>
                    <Controller
                        control={control}
                        name="phoneNumber"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Phone Number"
                                keyboardType="number-pad"
                                value={value}
                                onChangeText={onChange}
                                maxLength={10}
                            />
                        )}
                    />
                </View>
                {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>}

                <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>

                <View style={styles.orDivider}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>or</Text>
                    <View style={styles.line} />
                </View>

                {/* Social Login Placeholders */}
                <TouchableOpacity style={styles.socialButton}>
                    <Text style={styles.socialText}>Continue with Google</Text>
                </TouchableOpacity>

                {Platform.OS === 'ios' && (
                    <TouchableOpacity style={styles.socialButton}>
                        <Text style={styles.socialText}>Continue with Apple</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.terms}>
                By continuing, you agree to our Terms of Service & Privacy Policy
            </Text>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        marginTop: 60,
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 50,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
    },
    divider: {
        width: 40,
        height: 4,
        backgroundColor: '#333',
        marginVertical: 20,
        borderRadius: 2,
    },
    subHeading: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
    },
    form: {
        marginTop: 40,
    },
    inputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        height: 50,
        alignItems: 'center',
    },
    countryCode: {
        paddingHorizontal: 15,
        borderRightWidth: 1,
        borderRightColor: '#ccc',
    },
    countryText: {
        fontSize: 16,
        fontWeight: '600',
    },
    input: {
        flex: 1,
        paddingHorizontal: 15,
        fontSize: 16,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
    button: {
        backgroundColor: '#E23744',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    orDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    orText: {
        marginHorizontal: 10,
        color: '#666',
    },
    socialButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    socialText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },
    terms: {
        textAlign: 'center',
        color: '#999',
        fontSize: 12,
        marginTop: 'auto',
        marginBottom: 20,
    },
});

export default LoginScreen;
