import { api } from './index';

export const paymentsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createPaymentOrder: builder.mutation<{ transactionId: string; razorpayOrderId: string; amount: number; currency: string; key: string }, { orderId: string, amount: number }>({
            query: (data) => ({
                url: '/payments/create-order', // Matches controller: @Post('create-order')
                method: 'POST',
                data,
            }),
        }),
        verifyPayment: builder.mutation<{ success: boolean }, { orderId: string; paymentId: string; razorpayOrderId: string; signature: string }>({
            query: (data) => ({
                url: '/payments/verify',
                method: 'POST',
                data,
            }),
        }),
    }),
});

export const {
    useCreatePaymentOrderMutation,
    useVerifyPaymentMutation
} = paymentsApi;
