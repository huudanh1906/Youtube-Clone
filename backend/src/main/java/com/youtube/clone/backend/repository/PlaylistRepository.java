package com.youtube.clone.backend.repository;

import com.youtube.clone.backend.model.Playlist;
import com.youtube.clone.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    // Tìm danh sách playlist của một người dùng
    List<Playlist> findByUserOrderByUpdatedAtDesc(User user);

    // Tìm một playlist cụ thể của người dùng theo id
    Playlist findByIdAndUser(Long id, User user);

    // Tìm một playlist công khai theo id (dành cho người dùng khác xem)
    Playlist findByIdAndPrivacy(Long id, String privacy);
}