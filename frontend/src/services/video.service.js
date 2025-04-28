import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/videos/likes';

class VideoService {
    async getLikedVideos() {
        try {
            const header = authHeader();
            if (!header.Authorization) {
                // Không có token - người dùng chưa đăng nhập
                return [];
            }

            const response = await axios.get(API_URL, { headers: header });
            return response.data;
        } catch (error) {
            console.error("Error fetching liked videos:", error);
            return [];
        }
    }

    async likeVideo(videoData) {
        try {
            const header = authHeader();
            if (!header.Authorization) {
                // Không có token - người dùng chưa đăng nhập
                throw new Error("Not logged in");
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
                    channelTitle: videoData.channelTitle || ''
                },
                {
                    headers: header
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error liking video:", error);
            throw error;
        }
    }

    async unlikeVideo(videoId) {
        try {
            const header = authHeader();
            if (!header.Authorization) {
                // Không có token - người dùng chưa đăng nhập
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
            console.error("Error unliking video:", error);
            throw error;
        }
    }

    async isVideoLiked(videoId) {
        try {
            const header = authHeader();
            if (!header.Authorization) {
                // Không có token - người dùng chưa đăng nhập
                return false;
            }

            const response = await axios.get(
                `${API_URL}/${videoId}/check`,
                {
                    headers: header
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error checking if video is liked:", error);
            return false;
        }
    }
}

export default new VideoService(); 