import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'OTPVerification'>;
type RouteProps = RouteProp<AuthStackParamList, 'OTPVerification'>;

const OTPVerificationScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute<RouteProps>();
    const { phoneNumber } = route.params;

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const inputs = useRef<Array<TextInput | null>>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    const handleVerify = () => {
        const otpString = otp.join('');
        console.log('Verifying OTP:', otpString);
        // OTP Validation Logic Mock
        if (otpString.length === 6) {
            // Assume New User for flow
            navigation.navigate('Signup', { phoneNumber });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>We have sent a verification code to</Text>
            <Text style={styles.phone}>+91 {phoneNumber}</Text>

            <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => (inputs.current[index] = ref)}
                        style={styles.otpInput}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onChangeText={(text) => handleOtpChange(text, index)}
                        autoFocus={index === 0}
                    />
                ))}
            </View>

            <View style={styles.timerContainer}>
                {timer > 0 ? (
                    <Text style={styles.timerText}>Resend SMS in {timer}s</Text>
                ) : (
                    <TouchableOpacity onPress={() => setTimer(30)}>
                        <Text style={styles.resendText}>Resend OTP</Text>
                    </TouchableOpacity>
                )}
            </View>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: otp.join('').length === 6 ? '#E23744' : '#ccc' }]}
                onPress={handleVerify}
                disabled={otp.join('').length !== 6}
            >
                <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    phone: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    otpInput: {
        width: 45,
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 18,
    },
    timerContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    timerText: {
        color: '#666',
    },
    resendText: {
        color: '#E23744',
        fontWeight: 'bold',
    },
    button: {
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default OTPVerificationScreen;
