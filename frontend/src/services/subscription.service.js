import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/subscriptions';

class SubscriptionService {
    async subscribe(channelId, channelTitle, channelThumbnailUrl) {
        try {
            const header = authHeader();
            if (!header.Authorization) {
                throw new Error("Not logged in");
            }

            const response = await axios.post(
                API_URL,
                {
                    channelId,
                    channelTitle,
                    channelThumbnailUrl
                },
                { headers: header }
            );
            return response.data;
        } catch (error) {
            console.error("Error subscribing to channel:", error);
            throw error;
        }
    }

    async unsubscribe(channelId) {
        try {
            const header = authHeader();
            if (!header.Authorization) {
                throw new Error("Not logged in");
            }

            const response = await axios.delete(
                `${API_URL}/${channelId}`,
                { headers: header }
            );
            return response.data;
        } catch (error) {
            console.error("Error unsubscribing from channel:", error);
            throw error;
        }
    }

    async isSubscribed(channelId) {
        try {
            const header = authHeader();
            if (!header.Authorization) {
                return false;
            }

            const response = await axios.get(
                `${API_URL}/check/${channelId}`,
                { headers: header }
            );
            return response.data;
        } catch (error) {
            console.error("Error checking subscription status:", error);
            return false;
        }
    }

    async getMySubscriptions() {
        try {
            const header = authHeader();
            if (!header.Authorization) {
                return [];
            }

            const response = await axios.get(
                `${API_URL}/my-subscriptions`,
                { headers: header }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching subscriptions:", error);
            return [];
        }
    }

    async getSubscribers(channelId) {
        try {
            const response = await axios.get(`${API_URL}/subscribers/${channelId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching subscribers:", error);
            return [];
        }
    }

    async getSubscriberCount(channelId) {
        try {
            const response = await axios.get(`${API_URL}/count/${channelId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching subscriber count:", error);
            return 0;
        }
    }
}

export default new SubscriptionService(); 