import { NativeBiometric } from 'capacitor-native-biometric';
import { Capacitor } from '@capacitor/core';

export const BiometricService = {
    async isAvailable(): Promise<boolean> {
        if (!Capacitor.isNativePlatform()) {
            return false;
        }

        try {
            const result = await NativeBiometric.isAvailable();
            return result.isAvailable;
        } catch (error) {
            console.error('Biometric availability check failed', error);
            return false;
        }
    },

    async verifyIdentity(): Promise<boolean> {
        try {
            const result = await NativeBiometric.verifyIdentity({
                reason: 'Log in to Language Gems',
                title: 'Log in',
                subtitle: 'Use Face ID or Fingerprint',
                description: 'Please authenticate to continue',
            });
            return true;
        } catch (error) {
            console.error('Biometric verification failed', error);
            return false;
        }
    },

    async setCredentials(username: string, password: string): Promise<void> {
        try {
            await NativeBiometric.setCredentials({
                username,
                password,
                server: 'languagegems.com',
            });
        } catch (error) {
            console.error('Failed to save biometric credentials', error);
        }
    },

    async getCredentials(): Promise<{ username?: string; password?: string } | null> {
        try {
            const credentials = await NativeBiometric.getCredentials({
                server: 'languagegems.com',
            });
            return credentials;
        } catch (error) {
            return null;
        }
    },

    async deleteCredentials(): Promise<void> {
        try {
            await NativeBiometric.deleteCredentials({
                server: 'languagegems.com',
            });
        } catch (error) {
            console.error('Failed to delete biometric credentials', error);
        }
    }
};
