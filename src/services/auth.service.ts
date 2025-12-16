import { AuthService as ApiAuthService, SignupDto } from '@zomato/api-client';

export const AuthService = {
    sendOtp: async (phoneNumber: string) => {
        try {
            return await ApiAuthService.sendOtp({ phoneNumber, isLogin: true });
        } catch (error) {
            console.error('Send OTP failed:', error);
            throw error;
        }
    },
    verifyOtp: async (phoneNumber: string, otp: string) => {
        try {
            return await ApiAuthService.verifyOtp({ phoneNumber, otp });
        } catch (error) {
            console.error('Verify OTP failed:', error);
            throw error;
        }
    },
    signup: async (data: SignupDto) => {
        try {
            return await ApiAuthService.signup(data);
        } catch (error) {
            console.error('Signup failed:', error);
            throw error;
        }
    },
    logout: async () => {
        try {
            return await ApiAuthService.logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }
};
