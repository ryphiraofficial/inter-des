import webpush from 'web-push';
import PushSubscription from '../../models/shared/PushSubscription.js';

// Setup VAPID details if keys are provided
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        process.env.VAPID_MAILTO || 'mailto:admin@example.com',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
} else {
    console.warn('⚠️ WARNING: VAPID_PUBLIC_KEY or VAPID_PRIVATE_KEY is missing. Push notifications will be disabled.');
}

/**
 * @desc    Subscribe a user to push notifications
 * @route   POST /api/push/subscribe
 * @access  Private
 */
export const subscribeUser = async (req, res) => {
    try {
        const subscription = req.body;
        
        if (!subscription || !subscription.endpoint) {
            return res.status(400).json({ success: false, message: 'Invalid subscription object' });
        }

        // Upsert subscription based on endpoint
        await PushSubscription.findOneAndUpdate(
            { endpoint: subscription.endpoint },
            { 
                user: req.user._id,
                endpoint: subscription.endpoint,
                keys: subscription.keys
            },
            { upsert: true, new: true }
        );

        res.status(201).json({ success: true, message: 'Subscribed to push notifications' });
    } catch (error) {
        console.error('Push Subscribe Error:', error);
        res.status(500).json({ success: false, message: 'Failed to subscribe' });
    }
};

/**
 * @desc    Unsubscribe a user from push notifications
 * @route   POST /api/push/unsubscribe
 * @access  Private
 */
export const unsubscribeUser = async (req, res) => {
    try {
        const { endpoint } = req.body;
        
        if (!endpoint) {
            return res.status(400).json({ success: false, message: 'Endpoint is required' });
        }

        await PushSubscription.findOneAndDelete({ endpoint, user: req.user._id });

        res.status(200).json({ success: true, message: 'Unsubscribed from push notifications' });
    } catch (error) {
        console.error('Push Unsubscribe Error:', error);
        res.status(500).json({ success: false, message: 'Failed to unsubscribe' });
    }
};

/**
 * Reusable helper to send push notifications to a list of users
 * @param {Array<string>} userIds Array of MongoDB User ObjectIds
 * @param {Object} payload Payload object (title, body, url, etc.)
 */
export const sendPushNotification = async (userIds, payload) => {
    try {
        if (!userIds || userIds.length === 0) return;

        const subscriptions = await PushSubscription.find({ user: { $in: userIds } });
        
        if (subscriptions.length === 0) return;

        const payloadString = JSON.stringify(payload);

        // Send to all subscriptions in parallel, remove expired ones
        const promises = subscriptions.map(sub => 
            webpush.sendNotification(
                { endpoint: sub.endpoint, keys: sub.keys },
                payloadString
            ).catch(err => {
                if (err.statusCode === 404 || err.statusCode === 410) {
                    console.log('Subscription has expired or is no longer valid: ', err);
                    return PushSubscription.findByIdAndDelete(sub._id);
                }
                console.error('Push notification send error:', err);
            })
        );

        await Promise.all(promises);
    } catch (error) {
        console.error('Error in sendPushNotification helper:', error);
    }
};
