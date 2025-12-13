import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

interface NetworkContextType {
    isConnected: boolean;
    isInternetReachable: boolean;
}

const NetworkContext = createContext<NetworkContextType>({
    isConnected: true,
    isInternetReachable: true,
});

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [networkState, setNetworkState] = useState<{
        isConnected: boolean;
        isInternetReachable: boolean;
    }>({
        isConnected: true,
        isInternetReachable: true,
    });

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
            const isConnected = state.isConnected ?? true; // Default to true if null (e.g. unknown)
            const isInternetReachable = state.isInternetReachable ?? true;

            // Optional: Show toast on status change if desired, but banner is usually better
            if (!isConnected && networkState.isConnected) {
                Toast.show({
                    type: 'error',
                    text1: 'You are offline',
                    text2: 'Please check your internet connection',
                });
            } else if (isConnected && !networkState.isConnected) {
                Toast.show({
                    type: 'success',
                    text1: 'Back online',
                    text2: 'Connection restored',
                });
            }

            setNetworkState({
                isConnected,
                isInternetReachable,
            });
        });

        return () => {
            unsubscribe();
        };
    }, [networkState.isConnected]);

    return (
        <NetworkContext.Provider value={networkState}>
            {children}
        </NetworkContext.Provider>
    );
};
