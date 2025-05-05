import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/playlists';

class PlaylistService {
    /**
     * Lấy tất cả playlist của người dùng đã đăng nhập
     */
    async getPlaylists() {
        try {
            const header = authHeader();
            if (!header.Authorization) {
                // Người dùng chưa đăng nhập
                return [];
            }

            const response = await axios.get(API_URL, { headers: header });
            return response.data;
        } catch (error) {
            console.error("Error fetching playlists:", error);
            return [];
        }
    }

    /**
     * Lấy chi tiết một playlist
     */
    async getPlaylistById(playlistId) {
        try {
            const header = authHeader();
            if (!header.Authorization) {
                throw new Error("Not logged in");
            }

            const response = await axios.get(`${API_URL}/${playlistId}`, { headers: header });
            return response.data;
        } catch (error) {
            console.error("Error fetching playlist:", error);
            throw error;
        }
    }

    /**
     * Lấy tất cả video trong một playlist
     */
    async getPlaylistItems(playlistId) {
        try {
            const header = authHeader();
            if (!header.Authorization) {
                throw new Error("Not logged in");
            }

            const response = await axios.get(`${API_URL}/${playlistId}/items`, { headers: header });
            return response.data;
        } catch (error) {
            console.error("Error fetching playlist items:", error);
            return [];
        }
    }

    /**
     * Tạo playlist mới
     */
    async createPlaylist(name, description = "", privacy = "private") {
        try {
            const header = authHeader();
            if (!header.Authorization) {
                throw new Error("Not logged in");
            }

            const response = await axios.post(
                API_URL,
                {
                    name,
                    description,
                    privacy
                },
                {
                    headers: header
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error creating playlist:", error);
            throw error;
        }
    }

    /**
     * Thêm video vào playlist
     */
    async addToPlaylist(playlistId, videoData) {
        try {
            const header = authHeader();
            if (!header.Authorization) {
                throw new Error("Not logged in");
            }

            // Truncate description if it's too long
            const description = videoData.description ?
                videoData.description.substring(0, 1000) : '';

            const response = await axios.post(
                `${API_URL}/${playlistId}/items`,
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
            console.error("Error adding to playlist:", error);
            throw error;
        }
    }

    /**
     * Xóa video khỏi playlist
     */
    async removeFromPlaylist(playlistId, itemId) {
        try {
            const header = authHeader();
            if (!header.Authorization) {
                throw new Error("Not logged in");
            }

            await axios.delete(
                `${API_URL}/${playlistId}/items/${itemId}`,
                {
                    headers: header
                }
            );
            return true;
        } catch (error) {
            console.error("Error removing item from playlist:", error);
            throw error;
        }
    }

    /**
     * Xóa playlist
     */
    async deletePlaylist(playlistId) {
        try {
            if (!playlistId) {
                throw new Error("Playlist ID is required");
            }

            const header = authHeader();
            if (!header.Authorization) {
                throw new Error("Not logged in");
            }

            await axios.delete(
                `${API_URL}/${playlistId}`,
                {
                    headers: header
                }
            );
            return true;
        } catch (error) {
            console.error("Error deleting playlist:", error);
            throw error;
        }
    }

    /**
     * Lấy số lượng video thực tế trong một playlist
     */
    async getPlaylistItemCount(playlistId) {
        try {
            const header = authHeader();
            if (!header.Authorization) {
                throw new Error("Not logged in");
            }

            const items = await this.getPlaylistItems(playlistId);
            return items.length;
        } catch (error) {
            console.error("Error fetching playlist item count:", error);
            return 0;
        }
    }
}

export default new PlaylistService(); 