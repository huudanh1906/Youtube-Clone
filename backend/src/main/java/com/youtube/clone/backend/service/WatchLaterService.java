package com.youtube.clone.backend.service;

import com.youtube.clone.backend.model.User;
import com.youtube.clone.backend.model.WatchLater;
import com.youtube.clone.backend.payload.request.AddToWatchLaterRequest;
import com.youtube.clone.backend.repository.UserRepository;
import com.youtube.clone.backend.repository.WatchLaterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class WatchLaterService {

    @Autowired
    private WatchLaterRepository watchLaterRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Lấy tất cả video trong danh sách Watch Later của người dùng
     */
    public List<WatchLater> getWatchLaterItems(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        return watchLaterRepository.findByUserOrderByAddedAtDesc(user);
    }

    /**
     * Kiểm tra xem một video đã có trong danh sách Watch Later của người dùng chưa
     */
    public boolean isInWatchLater(Long userId, String videoId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        return watchLaterRepository.findByUserAndVideoId(user, videoId).isPresent();
    }

    /**
     * Thêm video vào danh sách Watch Later
     */
    @Transactional
    public WatchLater addToWatchLater(Long userId, AddToWatchLaterRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Kiểm tra xem video đã có trong danh sách Watch Later chưa
        Optional<WatchLater> existingItem = watchLaterRepository.findByUserAndVideoId(user, request.getVideoId());
        if (existingItem.isPresent()) {
            return existingItem.get(); // Video đã tồn tại trong danh sách
        }

        // Tạo item mới
        WatchLater watchLater = new WatchLater(
                user,
                request.getVideoId(),
                request.getTitle(),
                request.getDescription(),
                request.getThumbnailUrl(),
                request.getChannelTitle(),
                request.getDuration());

        return watchLaterRepository.save(watchLater);
    }

    /**
     * Xóa video khỏi danh sách Watch Later
     */
    @Transactional
    public void removeFromWatchLater(Long userId, String videoId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        watchLaterRepository.deleteByUserAndVideoId(user, videoId);
    }
}