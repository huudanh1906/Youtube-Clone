package com.youtube.clone.backend.repository;

import com.youtube.clone.backend.model.Playlist;
import com.youtube.clone.backend.model.PlaylistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaylistItemRepository extends JpaRepository<PlaylistItem, Long> {
    // Tìm tất cả video trong một playlist, sắp xếp theo vị trí
    List<PlaylistItem> findByPlaylistOrderByPositionAsc(Playlist playlist);

    // Tìm một video cụ thể trong playlist
    Optional<PlaylistItem> findByPlaylistAndVideoId(Playlist playlist, String videoId);

    // Đếm số lượng video trong playlist
    long countByPlaylist(Playlist playlist);

    // Lấy vị trí lớn nhất trong playlist
    @Query("SELECT MAX(p.position) FROM PlaylistItem p WHERE p.playlist = ?1")
    Integer findMaxPositionInPlaylist(Playlist playlist);

    // Lấy video theo vị trí
    Optional<PlaylistItem> findByPlaylistAndPosition(Playlist playlist, Integer position);
}