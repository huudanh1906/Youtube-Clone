package com.youtube.clone.backend.repository;

import com.youtube.clone.backend.model.User;
import com.youtube.clone.backend.model.WatchLater;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchLaterRepository extends JpaRepository<WatchLater, Long> {

    // Tìm tất cả video trong danh sách "Xem sau" của một người dùng
    List<WatchLater> findByUserOrderByAddedAtDesc(User user);

    // Kiểm tra xem video đã có trong danh sách "Xem sau" chưa
    Optional<WatchLater> findByUserAndVideoId(User user, String videoId);

    // Đếm số lượng video trong danh sách "Xem sau"
    long countByUser(User user);

    // Xóa video khỏi danh sách "Xem sau"
    void deleteByUserAndVideoId(User user, String videoId);
}