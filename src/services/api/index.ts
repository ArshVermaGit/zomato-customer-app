import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';

// Split API definition
export const api = createApi({
    baseQuery: axiosBaseQuery({ baseUrl: '' }),
    tagTypes: ['User', 'Restaurants', 'Orders', 'Cart'],
    endpoints: () => ({}),
});
