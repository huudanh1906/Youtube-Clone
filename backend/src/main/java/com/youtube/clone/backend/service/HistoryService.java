package com.youtube.clone.backend.service;

import com.youtube.clone.backend.model.History;
import com.youtube.clone.backend.model.User;
import com.youtube.clone.backend.payload.request.AddToHistoryRequest;
import com.youtube.clone.backend.repository.HistoryRepository;
import com.youtube.clone.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class HistoryService {

    private static final int MAX_HISTORY_ITEMS = 10;

    @Autowired
    private HistoryRepository historyRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Lấy lịch sử xem của người dùng
     */
    public List<History> getUserHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        return historyRepository.findByUserOrderByLastViewedAtDesc(user);
    }

    /**
     * Thêm hoặc cập nhật video vào lịch sử xem
     * Nếu đã quá 10 video, sẽ xóa video cũ nhất
     */
    @Transactional
    public History addToHistory(Long userId, AddToHistoryRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Kiểm tra xem video đã có trong lịch sử xem chưa
        Optional<History> existingHistoryOpt = historyRepository.findByUserAndVideoId(user, request.getVideoId());

        if (existingHistoryOpt.isPresent()) {
            // Nếu video đã có trong lịch sử, cập nhật thời gian xem mới nhất
            History existingHistory = existingHistoryOpt.get();
            existingHistory.setLastViewedAt(LocalDateTime.now());
            return historyRepository.save(existingHistory);
        }

        // Kiểm tra số lượng video trong lịch sử
        long historyCount = historyRepository.countByUser(user);

        // Nếu đã đạt tới giới hạn, xóa video cũ nhất
        if (historyCount >= MAX_HISTORY_ITEMS) {
            List<History> oldestItems = historyRepository.findOldestHistoryItems(user);
            if (!oldestItems.isEmpty()) {
                historyRepository.delete(oldestItems.get(0));
            }
        }

        // Thêm video mới vào lịch sử
        History newHistory = new History(
                user,
                request.getVideoId(),
                request.getTitle(),
                request.getDescription(),
                request.getThumbnailUrl(),
                request.getChannelTitle(),
                request.getDuration());

        return historyRepository.save(newHistory);
    }

    /**
     * Xóa một video khỏi lịch sử xem
     */
    @Transactional
    public void removeFromHistory(Long userId, String videoId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Optional<History> historyItemOpt = historyRepository.findByUserAndVideoId(user, videoId);
        historyItemOpt.ifPresent(historyRepository::delete);
    }

    /**
     * Xóa toàn bộ lịch sử xem của người dùng
     */
    @Transactional
    public void clearHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        List<History> userHistory = historyRepository.findByUserOrderByLastViewedAtDesc(user);
        historyRepository.deleteAll(userHistory);
    }
}