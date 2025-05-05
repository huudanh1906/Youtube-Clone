/**
 * Service quản lý bộ nhớ đệm (cache) giúp giảm số yêu cầu API gửi đến YouTube
 */

class CacheService {
    constructor() {
        this.cache = {};
        this.defaultExpiration = 1000 * 60 * 60; // 1 giờ mặc định
        this.extendRatio = 0.5; // Hệ số gia hạn, mặc định là 50% thời gian ban đầu
    }

    /**
     * Lấy dữ liệu từ cache
     * @param {string} key - Khóa cache
     * @returns {any|null} - Dữ liệu đã cache hoặc null nếu không tìm thấy
     */
    get(key) {
        const item = this.cache[key];
        if (!item) return null;

        // Kiểm tra xem cache có hết hạn không
        if (item.expiry && item.expiry < Date.now()) {
            this.delete(key);
            return null;
        }

        // Tự động gia hạn cache khi truy cập
        this._extendCacheExpiry(key, item);

        return item.value;
    }

    /**
     * Gia hạn thời gian sống của cache
     * @param {string} key - Khóa cache
     * @param {Object} item - Item cache
     * @private
     */
    _extendCacheExpiry(key, item) {
        if (!item || !item.originalTTL) return;

        // Tính thời gian còn lại của cache
        const remainingTime = item.expiry - Date.now();
        // Nếu thời gian còn lại ít hơn 50% thời gian ban đầu, gia hạn thêm
        if (remainingTime < item.originalTTL * 0.5) {
            // Tính thêm thời gian sống (tối đa là originalTTL)
            const extensionTime = Math.min(
                item.originalTTL * this.extendRatio,
                item.originalTTL - remainingTime
            );

            // Cập nhật thời gian hết hạn
            item.expiry = item.expiry + extensionTime;
            console.log(`🔄 Extended cache expiry for: ${key} by ${Math.round(extensionTime / 1000 / 60)} minutes`);

            // Lưu lại vào localStorage
            this._saveToLocalStorage();
        }
    }

    /**
     * Lưu dữ liệu vào cache
     * @param {string} key - Khóa cache
     * @param {any} value - Giá trị cần lưu
     * @param {number|null} ttl - Thời gian sống tính bằng mili giây
     */
    set(key, value, ttl = null) {
        const originalTTL = ttl || this.defaultExpiration;
        const expiry = Date.now() + originalTTL;

        this.cache[key] = {
            value,
            expiry,
            originalTTL  // Lưu thời gian sống ban đầu để dùng cho việc gia hạn
        };

        // Đồng thời lưu vào localStorage để phục hồi khi refresh trang
        this._saveToLocalStorage();
    }

    /**
     * Xóa một mục trong cache
     * @param {string} key - Khóa cache cần xóa
     */
    delete(key) {
        delete this.cache[key];
        this._saveToLocalStorage();
    }

    /**
     * Xóa tất cả cache
     */
    clear() {
        this.cache = {};
        localStorage.removeItem('youtube_cache');
    }

    /**
     * Lưu cache vào localStorage
     * @private
     */
    _saveToLocalStorage() {
        try {
            localStorage.setItem('youtube_cache', JSON.stringify(this.cache));
        } catch (e) {
            console.warn('Không thể lưu cache vào localStorage:', e);
        }
    }

    /**
     * Phục hồi cache từ localStorage
     * @private
     */
    _loadFromLocalStorage() {
        try {
            const savedCache = localStorage.getItem('youtube_cache');
            if (savedCache) {
                this.cache = JSON.parse(savedCache);

                // Đảm bảo mỗi item cache đều có originalTTL
                Object.keys(this.cache).forEach(key => {
                    const item = this.cache[key];
                    if (!item.originalTTL && item.expiry) {
                        // Nếu không có originalTTL, ước tính dựa vào thời gian hết hạn
                        item.originalTTL = item.expiry - Date.now();
                        // Nếu ước tính âm hoặc quá nhỏ, gán giá trị mặc định
                        if (item.originalTTL <= 0) {
                            item.originalTTL = this.defaultExpiration;
                        }
                    }
                });

                // Dọn dẹp các cache đã hết hạn
                this._cleanExpiredCache();
            }
        } catch (e) {
            console.warn('Không thể phục hồi cache từ localStorage:', e);
        }
    }

    /**
     * Dọn dẹp các cache đã hết hạn
     * @private
     */
    _cleanExpiredCache() {
        const now = Date.now();
        const expiredKeys = [];

        Object.keys(this.cache).forEach(key => {
            const item = this.cache[key];
            if (item.expiry && item.expiry < now) {
                expiredKeys.push(key);
            }
        });

        // Xóa các cache đã hết hạn
        expiredKeys.forEach(key => this.delete(key));

        // Nếu có cache bị xóa, lưu lại localStorage
        if (expiredKeys.length > 0) {
            console.log(`🧹 Cleaned ${expiredKeys.length} expired cache items`);
            this._saveToLocalStorage();
        }
    }

    /**
     * Lấy dữ liệu từ cache hoặc gọi hàm cung cấp nếu không có cache
     * @param {string} key - Khóa cache
     * @param {Function} provider - Hàm trả về Promise cung cấp dữ liệu
     * @param {number|null} ttl - Thời gian sống tính bằng mili giây
     * @returns {Promise<any>} - Dữ liệu từ cache hoặc hàm cung cấp
     */
    async getOrFetch(key, provider, ttl = null) {
        const cachedData = this.get(key);
        if (cachedData !== null) {
            console.log(`🔄 Using cached data for: ${key.split('-')[0]}`);
            return cachedData;
        }

        try {
            const data = await provider();
            this.set(key, data, ttl);
            return data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Khởi tạo cache từ localStorage
     */
    init() {
        this._loadFromLocalStorage();
    }
}

// Tạo instance singleton
const cacheService = new CacheService();
cacheService.init();

export default cacheService; 