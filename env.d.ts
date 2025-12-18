declare module '@env' {
    export const API_URL: string;
    export const GOOGLE_MAPS_API_KEY: string;
    export const RAZORPAY_KEY_ID: string;
    export const NODE_ENV: 'development' | 'production' | 'test';
}

declare namespace NodeJS {
    interface ProcessEnv {
        API_URL: string;
        GOOGLE_MAPS_API_KEY: string;
        RAZORPAY_KEY_ID: string;
        NODE_ENV: 'development' | 'production' | 'test';
    }
}
