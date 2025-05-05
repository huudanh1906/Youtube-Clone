import axios from 'axios'
import cacheService from '../services/cache.service'

const API_KEY = 'AIzaSyD4tOqFYMQ0tZzQtOZTMg6QGaDyO7ZEW54';
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

// Thời gian cache mặc định cho mỗi loại yêu cầu (ms)
const CACHE_TTL = {
  '/videos': 1000 * 60 * 60 * 2, // 2 giờ 
  '/channels': 1000 * 60 * 60 * 24, // 24 giờ
  '/search': 1000 * 60 * 60 * 1, // 1 giờ - tiêu tốn nhiều quota nhất (100 units)
  '/playlists': 1000 * 60 * 60 * 6, // 6 giờ 
  '/playlistItems': 1000 * 60 * 60, // 1 giờ 
  '/commentThreads': 1000 * 60 * 30, // 30 phút 
  'default': 1000 * 60 * 60 // 1 giờ mặc định 
};

/**
 * Gửi yêu cầu đến YouTube API với caching
 * @param {string} endpoint - Đường dẫn API endpoint
 * @param {object} options - Tùy chọn axios
 * @param {boolean} useCache - Có sử dụng cache không
 * @returns {Promise<any>} - Phản hồi từ API
 */
export const request = (endpoint, options = {}, useCache = true) => {
  const params = {
    key: API_KEY,
    ...options.params,
  };

  // Tạo cache key dựa trên endpoint và params
  const cacheKey = `${endpoint}-${JSON.stringify(params)}`;

  // Xác định TTL dựa trên endpoint
  let ttl = CACHE_TTL.default;
  for (const key in CACHE_TTL) {
    if (endpoint.startsWith(key)) {
      ttl = CACHE_TTL[key];
      break;
    }
  }

  // Nếu không sử dụng cache, gọi API trực tiếp
  if (!useCache) {
    return axios.get(`${BASE_URL}${endpoint}`, {
      ...options,
      params
    });
  }

  // Sử dụng cache
  return cacheService.getOrFetch(
    cacheKey,
    async () => {
      console.log(`🔄 Fetching fresh data for: ${endpoint}`);
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        ...options,
        params
      });
      return response;
    },
    ttl
  );
};

/**
 * Xóa cache cho một loại yêu cầu cụ thể
 * @param {string} endpointPrefix - Tiền tố endpoint cần xóa cache
 */
export const clearCacheForEndpoint = (endpointPrefix) => {
  const cache = cacheService.cache;
  Object.keys(cache).forEach(key => {
    if (key.startsWith(endpointPrefix)) {
      cacheService.delete(key);
    }
  });
};

/**
 * Xóa toàn bộ cache
 */
export const clearAllCache = () => {
  cacheService.clear();
};