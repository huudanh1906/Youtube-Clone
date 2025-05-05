package com.youtube.clone.backend.repository;

import com.youtube.clone.backend.model.History;
import com.youtube.clone.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HistoryRepository extends JpaRepository<History, Long> {
    // Tìm tất cả các video trong lịch sử xem của một user, sắp xếp theo thời gian
    // xem mới nhất
    List<History> findByUserOrderByLastViewedAtDesc(User user);

    // Tìm lịch sử xem của một video cụ thể của user
    Optional<History> findByUserAndVideoId(User user, String videoId);

    // Đếm số lượng video trong lịch sử xem của user
    long countByUser(User user);

    // Tìm video cũ nhất trong lịch sử xem của user
    @Query("SELECT h FROM History h WHERE h.user = ?1 ORDER BY h.lastViewedAt ASC")
    List<History> findOldestHistoryItems(User user);
}