import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/watch-later';

class WatchLaterService {
    /**
     * Lấy tất cả video trong danh sách Watch Later
     */
    async getWatchLaterItems() {
        try {
            const header = authHeader();
            if (!header.Authorization) {
                // Người dùng chưa đăng nhập
                return [];
            }

            const response = await axios.get(API_URL, { headers: header });
            return response.data;
        } catch (error) {
            console.error("Error fetching watch later items:", error);
            return [];
        }
    }

    /**
     * Kiểm tra xem video đã có trong danh sách Watch Later chưa
     */
    async isInWatchLater(videoId) {
        try {
            const header = authHeader();
            if (!header.Authorization) {
                return false;
            }

            const response = await axios.get(`${API_URL}/check/${videoId}`, { headers: header });
            return response.data;
        } catch (error) {
            console.error("Error checking if video is in watch later:", error);
            return false;
        }
    }

    /**
     * Thêm video vào danh sách Watch Later
     */
    async addToWatchLater(videoData) {
        try {
            const header = authHeader();
            if (!header.Authorization) {
                throw new Error("Not logged in");
            }

            // Truncate description if it's too long
            const description = videoData.description ?
                videoData.description.substring(0, 1000) : '';

            const response = await axios.post(
                API_URL,
                {
                    videoId: videoData.videoId,
                    title: videoData.title,
                    description: description,
                    thumbnailUrl: videoData.thumbnailUrl || '',
                    channelTitle: videoData.channelTitle || '',
                    duration: videoData.duration || 0
                },
                {
                    headers: header
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error adding to watch later:", error);
            throw error;
        }
    }

    /**
     * Xóa video khỏi danh sách Watch Later
     */
    async removeFromWatchLater(videoId) {
        try {
            const header = authHeader();
            if (!header.Authorization) {
                throw new Error("Not logged in");
            }

            await axios.delete(
                `${API_URL}/${videoId}`,
                {
                    headers: header
                }
            );
            return true;
        } catch (error) {
            console.error("Error removing from watch later:", error);
            throw error;
        }
    }
}

export default new WatchLaterService(); 