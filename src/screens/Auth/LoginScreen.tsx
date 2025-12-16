import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChevronDown } from 'lucide-react-native';
import { colors, spacing, typography, borderRadius } from '@zomato/design-tokens';
import { Button } from '@zomato/ui';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { AuthService } from '../../services/auth.service';
import { LinearGradient } from 'expo-linear-gradient';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const { width } = Dimensions.get('window');

export const LoginScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('+91');
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = async () => {
        if (!phoneNumber || phoneNumber.length < 10) return;
        setIsLoading(true);
        try {
            // Call API
            await AuthService.sendOtp(`${countryCode}${phoneNumber}`); // Ensure format matches backend expectation (e.g. +919876543210)
            navigation.navigate('OTPVerification', { phoneNumber: `${countryCode} ${phoneNumber}`, countryCode });
        } catch (error) {
            // Handle error (show toast etc)
            console.error(error);
            // Fallback for demo if API fails (offline)
            // navigation.navigate('OTPVerification', { phoneNumber: `${countryCode} ${phoneNumber}`, countryCode });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Decorative Top Banner/Image (Optional, Zomato often uses food bg) */}
            <View style={styles.bannerContainer}>
                <Image
                    source={{ uri: 'https://b.zmtcdn.com/web_assets/81f3ff974d82520780078ba1cfbd453a1583259680.png' }} // Zomato Login Banner style
                    style={styles.bannerImage}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', colors.secondary.white]}
                    style={styles.gradient}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>India's #1 Food Delivery App</Text>
                    <View style={styles.dividerComponent}>
                        <View style={styles.line} />
                        <Text style={styles.loginText}>Log in or sign up</Text>
                        <View style={styles.line} />
                    </View>
                </View>

                {/* Phone Input */}
                <View style={styles.form}>
                    <View style={styles.phoneInputContainer}>
                        {/* Country Code Selector */}
                        <TouchableOpacity style={styles.countryCodeButton}>
                            <Text style={styles.countryCodeText}>{countryCode}</Text>
                            <ChevronDown size={16} color={colors.secondary.gray_600} />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        {/* Phone Number Input */}
                        <TextInput
                            style={styles.phoneInput}
                            placeholder="Enter mobile number"
                            placeholderTextColor={colors.secondary.gray_500}
                            keyboardType="phone-pad"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            maxLength={10}
                        />
                    </View>

                    {/* Continue Button */}
                    <View style={{ borderRadius: borderRadius.lg }}>
                        <Button
                            variant="primary"
                            fullWidth
                            loading={isLoading}
                            disabled={phoneNumber.length < 10}
                            onPress={handleContinue}
                        >
                            Continue
                        </Button>
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.orDivider}>
                    <View style={styles.orLine} />
                    <Text style={styles.orText}>or</Text>
                    <View style={styles.orLine} />
                </View>

                {/* Social Login */}
                <View style={styles.socialButtons}>
                    <TouchableOpacity style={styles.socialButton}>
                        {/* Using simple colored views or text as placeholder if icons missing. 
                 Real app would use SVG/Image assets. */}
                        <View style={[styles.socialIconPlaceholder, { backgroundColor: '#DB4437' }]}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>G</Text>
                        </View>
                        <Text style={styles.socialButtonText}>Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialButton}>
                        <View style={[styles.socialIconPlaceholder, { backgroundColor: '#000' }]}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}></Text>
                        </View>
                        <Text style={styles.socialButtonText}>Apple</Text>
                    </TouchableOpacity>
                </View>

                {/* Terms */}
                <Text style={styles.terms}>
                    By continuing, you agree to our{' '}
                    <Text style={styles.link}>Terms of Service</Text>
                    {' '}and{' '}
                    <Text style={styles.link}>Privacy Policy</Text>
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondary.white,
    },
    bannerContainer: {
        height: 200,
        width: '100%',
        position: 'relative',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.lg,
        paddingBottom: spacing['4xl'],
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    title: {
        ...typography.h3,
        color: colors.secondary.gray_900,
        marginBottom: spacing.xl,
        textAlign: 'center',
    },
    dividerComponent: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: spacing.md,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: colors.secondary.gray_300,
    },
    loginText: {
        ...typography.label_small,
        color: colors.secondary.gray_500,
        marginHorizontal: spacing.md,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    form: {
        marginBottom: spacing['3xl'],
    },
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.secondary.white,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.secondary.gray_300,
        paddingHorizontal: spacing.base,
        height: 50,
        marginBottom: spacing.lg,
    },
    countryCodeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingRight: spacing.base,
    },
    countryCodeText: {
        ...typography.body_large,
        color: colors.secondary.gray_900,
        fontWeight: '500',
    },
    divider: {
        width: 1,
        height: 24,
        backgroundColor: colors.secondary.gray_300,
        marginRight: spacing.base,
    },
    phoneInput: {
        flex: 1,
        ...typography.body_large,
        color: colors.secondary.gray_900,
        height: '100%',
    },
    orDivider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    orLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.secondary.gray_200,
    },
    orText: {
        ...typography.body_medium,
        color: colors.secondary.gray_500,
        marginHorizontal: spacing.base,
    },
    socialButtons: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing['2xl'],
        justifyContent: 'center',
    },
    socialButton: {
        flex: 1, // Make them expand
        flexDirection: 'row', // icon + text
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.secondary.white,
        borderWidth: 1,
        borderColor: colors.secondary.gray_200,
        borderRadius: borderRadius.full,
        gap: spacing.sm,
    },
    socialIconPlaceholder: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    socialButtonText: {
        ...typography.body_medium,
        color: colors.secondary.gray_800,
    },
    terms: {
        ...typography.caption,
        color: colors.secondary.gray_600,
        textAlign: 'center',
        paddingHorizontal: spacing.xl,
        lineHeight: 18,
    },
    link: {
        color: colors.primary.zomato_red,
        fontWeight: '600',
    },
});

export default LoginScreen;
