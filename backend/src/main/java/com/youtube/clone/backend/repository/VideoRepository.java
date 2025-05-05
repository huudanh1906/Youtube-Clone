package com.youtube.clone.backend.repository;

import com.youtube.clone.backend.model.User;
import com.youtube.clone.backend.model.Video;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    // Tìm video theo ID
    Optional<Video> findByVideoId(String videoId);

    // Tìm tất cả video của một người dùng
    List<Video> findByUserOrderByCreatedAtDesc(User user);

    // Tìm tất cả video đã publish của một người dùng
    List<Video> findByUserAndPublishedTrueOrderByCreatedAtDesc(User user);

    // Tìm tất cả video công khai đã publish
    Page<Video> findByPrivacyAndPublishedTrue(String privacy, Pageable pageable);

    // Tìm kiếm video theo tiêu đề (công khai và đã publish)
    Page<Video> findByTitleContainingAndPrivacyAndPublishedTrue(String keyword, String privacy, Pageable pageable);

    // Đếm số lượng video đã publish của một người dùng
    long countByUserAndPublishedTrue(User user);

    // Lấy video nổi bật (nhiều lượt xem nhất)
    @Query("SELECT v FROM Video v WHERE v.privacy = 'public' AND v.published = true ORDER BY v.viewCount DESC")
    Page<Video> findTrendingVideos(Pageable pageable);
}