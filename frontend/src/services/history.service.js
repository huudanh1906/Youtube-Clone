import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/history';

class HistoryService {
    /**
     * Lấy lịch sử xem video của người dùng
     */
    async getHistory() {
        try {
            const header = authHeader();
            if (!header.Authorization) {
                // Không có token - người dùng chưa đăng nhập
                return [];
            }

            const response = await axios.get(API_URL, { headers: header });
            return response.data;
        } catch (error) {
            console.error("Error fetching watch history:", error);
            return [];
        }
    }

    /**
     * Thêm video vào lịch sử xem
     */
    async addToHistory(videoData) {
        try {
            const header = authHeader();
            if (!header.Authorization) {
                // Không có token - người dùng chưa đăng nhập
                // Không lưu lịch sử nếu không đăng nhập
                return null;
            }

            // Truncate description if it's too long (limit to 1000 chars to be safe)
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
            console.error("Error adding to history:", error);
            return null;
        }
    }

    /**
     * Xóa một video khỏi lịch sử xem
     */
    async removeFromHistory(videoId) {
        try {
            const header = authHeader();
            if (!header.Authorization) {
                throw new Error("Not logged in");
            }

            const response = await axios.delete(
                `${API_URL}/${videoId}`,
                {
                    headers: header
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error removing video from history:", error);
            throw error;
        }
    }

    /**
     * Xóa toàn bộ lịch sử xem
     */
    async clearHistory() {
        try {
            const header = authHeader();
            if (!header.Authorization) {
                throw new Error("Not logged in");
            }

            const response = await axios.delete(
                API_URL,
                {
                    headers: header
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error clearing history:", error);
            throw error;
        }
    }
}

export default new HistoryService(); 