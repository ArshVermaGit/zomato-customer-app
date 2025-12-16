import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    Keyboard
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { ChevronLeft, MessageSquare } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '@zomato/design-tokens';
import { Button } from '@zomato/ui';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'OTPVerification'>;
type Props = StackScreenProps<AuthStackParamList, 'OTPVerification'>;

export const OTPVerificationScreen = ({ route }: Props) => {
    const navigation = useNavigation<NavigationProp>();
    const { phoneNumber } = route.params;
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const [timer, setTimer] = useState(30);
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (timer > 0) {
            interval = setInterval(() => setTimer(prev => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-focus prev input if deleted
        if (!value && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        // Auto-verify when all digits entered
        if (newOtp.every(digit => digit !== '')) {
            handleVerify(newOtp.join(''));
        }
    };

    const handleVerify = async (code: string) => {
        Keyboard.dismiss();
        setIsVerifying(true);

        // Simulate API verification
        setTimeout(async () => {
            setIsVerifying(false);
            // Assuming verification success
            // Set Auth Token and navigate
            await AsyncStorage.setItem('authToken', 'dummy_token_123');
            // Since we are in AuthNavigator, and RootNavigator checks token,
            // usually we need to reset navigation state or utilize a context change to trigger re-render of RootNavigator
            // OR, if RootNavigator is mounted, we might need to manually navigate or reload app context.
            // For this specific logic, I will restart the app flow logic (RootNavigator should pick up state change if using Context, 
            // but here we are using simple state in RootNavigator which ran once on mount).
            // We SHOULD reload usage of RootNavigator logic.
            // BUT, usually Login sets a global state.
            // Simplest hack: Navigate to "Main" if the navigator structure allows, or Replace.

            // Actually RootNavigator has:
            // <Stack.Screen name="Auth" component={AuthNavigator} />
            // <Stack.Screen name="Main" component={TabNavigator} />

            // So we should navigate up to "Main".
            // Verify navigation hierarchy.
            // AuthNavigator is nested in Root.
            // To go to sibling "Main", we access parent navigator.
            // The type NavigationProp is from AuthStackParamList, which doesn't know about "Main".
            // We cast or use composite navigation prop.

            (navigation.getParent() as any)?.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            });

        }, 1500);
    };

    const handleResend = () => {
        setTimer(30);
        // Logic to resend OTP
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <ChevronLeft size={24} color={colors.secondary.gray_900} />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    {/* Zomato Red Tint approx: rgba of zomato_red */}
                    <MessageSquare size={32} color={colors.primary.zomato_red} fill={'rgba(226, 55, 68, 0.1)'} strokeWidth={1} />
                </View>

                <Text style={styles.title}>OTP Verification</Text>
                <Text style={styles.subtitle}>
                    We've sent a verification code to{'\n'}
                    <Text style={styles.phoneNumber}>{phoneNumber}</Text>
                </Text>

                {/* OTP Inputs */}
                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref: TextInput | null) => { inputRefs.current[index] = ref; }}
                            style={[
                                styles.otpInput,
                                digit ? styles.otpInputFilled : null,
                            ]}
                            value={digit}
                            onChangeText={(value) => handleOtpChange(value, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            selectTextOnFocus
                            caretHidden // Hide caret for cleaner look if desired
                        />
                    ))}
                </View>

                {/* Resend */}
                <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>Didn't receive the code?</Text>
                    <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
                        <Text style={[styles.resendButton, timer > 0 && { color: colors.secondary.gray_400 }]}>
                            {timer > 0 ? `Resend in ${timer}s` : 'Resend Now'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {isVerifying && (
                    <View style={{ marginTop: 20 }}>
                        <Button loading={true} variant="ghost">Verifying...</Button>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.white,
    },
    header: {
        padding: spacing.base,
        alignItems: 'flex-start',
    },
    backButton: {
        padding: 8,
        borderRadius: borderRadius.full,
        backgroundColor: colors.secondary.gray_100,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.xl,
        alignItems: 'center',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: borderRadius.full, // Circle
        backgroundColor: colors.secondary.gray_100, // Or red tint
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
    },
    title: {
        ...typography.h2,
        color: colors.secondary.gray_900,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.body_medium,
        color: colors.secondary.gray_600,
        textAlign: 'center',
        marginBottom: spacing['3xl'],
    },
    phoneNumber: {
        color: colors.primary.zomato_red, // Highlight phone number
        fontWeight: '700',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.sm,
        marginBottom: spacing['2xl'],
        width: '100%',
    },
    otpInput: {
        width: 45,
        height: 50,
        borderRadius: borderRadius.lg,
        borderWidth: 1.5,
        borderColor: colors.secondary.gray_300,
        backgroundColor: colors.secondary.gray_50,
        ...typography.h3,
        textAlign: 'center',
        color: colors.secondary.gray_900,
    },
    otpInputFilled: {
        borderColor: colors.primary.zomato_red,
        backgroundColor: colors.secondary.white,
    },
    resendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
    },
    resendText: {
        ...typography.body_medium,
        color: colors.secondary.gray_600,
    },
    resendButton: {
        ...typography.label_medium,
        color: colors.primary.zomato_red,
        fontWeight: '700',
    },
});

export default OTPVerificationScreen;
