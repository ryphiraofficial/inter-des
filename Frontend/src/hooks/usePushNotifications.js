import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/slices/authSlice.js';
import { useSubscribePushMutation } from '../store/api/sharedApi.js';

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const usePushNotifications = () => {
    const user = useSelector(selectUser);
    const [subscribePush] = useSubscribePushMutation();

    useEffect(() => {
        const initializePush = async () => {
            if (!user || user.role === 'Client') return;
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
                return; // Push not supported
            }

            try {
                // Register Service Worker
                const registration = await navigator.serviceWorker.register('/sw.js');

                // Wait until service worker is active
                await navigator.serviceWorker.ready;

                // Check permission
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    console.log('Push notification permission denied');
                    return;
                }

                // Get existing subscription
                let subscription = await registration.pushManager.getSubscription();
                
                // If no subscription, subscribe
                if (!subscription) {
                    const publicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
                    if (!publicKey) {
                        console.error('VITE_VAPID_PUBLIC_KEY is missing');
                        return;
                    }

                    const convertedVapidKey = urlBase64ToUint8Array(publicKey);
                    subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: convertedVapidKey
                    });
                }

                // Send to backend
                await subscribePush(subscription).unwrap();
            } catch (error) {
                console.error('Error during push notification setup:', error);
            }
        };

        initializePush();
    }, [user, subscribePush]);
};
