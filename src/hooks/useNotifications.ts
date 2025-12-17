import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import { Platform, Alert } from 'react-native';
// Note: You need to implement the API call to register token
// import api from '../services/api'; 

export const useNotifications = (registerTokenApi?: (token: string) => Promise<any>) => {
    useEffect(() => {
        const requestUserPermission = async () => {
            const authStatus = await messaging().requestPermission();
            const enabled =
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL;

            if (enabled) {
                console.log('Authorization status:', authStatus);
                getFCMToken();
            }
        };

        const getFCMToken = async () => {
            try {
                const token = await messaging().getToken();
                console.log('FCM Token:', token);
                if (registerTokenApi && token) {
                    await registerTokenApi(token);
                }
            } catch (error) {
                console.log('Failed to get FCM token:', error);
            }
        };

        requestUserPermission();

        const unsubscribe = messaging().onMessage(async remoteMessage => {
            console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
            Alert.alert(
                remoteMessage.notification?.title || 'New Notification', // Fallback title
                remoteMessage.notification?.body || '', // Fallback body
            );
        });

        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log('Notification caused app to open from background state:', remoteMessage.notification);
        });

        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log('Notification caused app to open from quit state:', remoteMessage.notification);
                }
            });

        return unsubscribe;
    }, []);
};
