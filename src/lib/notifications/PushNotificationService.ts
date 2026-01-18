import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

export const PushNotificationService = {
    async init() {
        if (!Capacitor.isNativePlatform()) {
            return;
        }

        try {
            const result = await PushNotifications.requestPermissions();

            if (result.receive === 'granted') {
                await PushNotifications.register();
            } else {
                console.log('Push notification permission denied');
            }
        } catch (error) {
            console.warn('[PushNotificationService] Failed to initialize push notifications. This is likely due to missing Firebase configuration on Android.', error);
        }

        PushNotifications.addListener('registration',
            (token) => {
                console.log('Push registration success, token: ' + token.value);
            }
        );

        PushNotifications.addListener('registrationError',
            (error) => {
                console.log('Error on registration: ' + JSON.stringify(error));
            }
        );

        PushNotifications.addListener('pushNotificationReceived',
            (notification) => {
                console.log('Push received: ' + JSON.stringify(notification));
            }
        );

        PushNotifications.addListener('pushNotificationActionPerformed',
            (notification) => {
                console.log('Push action performed: ' + JSON.stringify(notification));
            }
        );
    }
};
