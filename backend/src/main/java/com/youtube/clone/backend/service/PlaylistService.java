package com.youtube.clone.backend.service;

import com.youtube.clone.backend.model.Playlist;
import com.youtube.clone.backend.model.PlaylistItem;
import com.youtube.clone.backend.model.User;
import com.youtube.clone.backend.payload.request.AddToPlaylistRequest;
import com.youtube.clone.backend.payload.request.CreatePlaylistRequest;
import com.youtube.clone.backend.repository.PlaylistItemRepository;
import com.youtube.clone.backend.repository.PlaylistRepository;
import com.youtube.clone.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PlaylistService {

    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private PlaylistItemRepository playlistItemRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Lấy tất cả playlist của người dùng
     */
    public List<Playlist> getUserPlaylists(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        return playlistRepository.findByUserOrderByUpdatedAtDesc(user);
    }

    /**
     * Lấy chi tiết một playlist
     */
    public Playlist getPlaylistById(Long userId, Long playlistId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Playlist playlist = playlistRepository.findByIdAndUser(playlistId, user);
        if (playlist == null) {
            throw new RuntimeException("Playlist not found with id: " + playlistId);
        }

        return playlist;
    }

    /**
     * Xem playlist công khai của người khác
     */
    public Playlist getPublicPlaylist(Long playlistId) {
        Playlist playlist = playlistRepository.findByIdAndPrivacy(playlistId, "public");
        if (playlist == null) {
            throw new RuntimeException("Public playlist not found with id: " + playlistId);
        }

        return playlist;
    }

    /**
     * Tạo playlist mới
     */
    @Transactional
    public Playlist createPlaylist(Long userId, CreatePlaylistRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Playlist playlist = new Playlist(
                user,
                request.getName(),
                request.getDescription(),
                request.getPrivacy());

        return playlistRepository.save(playlist);
    }

    /**
     * Thêm video vào playlist
     */
    @Transactional
    public PlaylistItem addToPlaylist(Long userId, Long playlistId, AddToPlaylistRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Playlist playlist = playlistRepository.findByIdAndUser(playlistId, user);
        if (playlist == null) {
            throw new RuntimeException("Playlist not found with id: " + playlistId);
        }

        // Kiểm tra xem video đã có trong playlist chưa
        Optional<PlaylistItem> existingItem = playlistItemRepository.findByPlaylistAndVideoId(playlist,
                request.getVideoId());
        if (existingItem.isPresent()) {
            return existingItem.get(); // Video đã tồn tại trong playlist
        }

        // Lấy vị trí tiếp theo trong playlist
        Integer maxPosition = playlistItemRepository.findMaxPositionInPlaylist(playlist);
        int nextPosition = (maxPosition == null) ? 0 : maxPosition + 1;

        // Tạo item mới
        PlaylistItem item = new PlaylistItem(
                playlist,
                request.getVideoId(),
                request.getTitle(),
                request.getDescription(),
                request.getThumbnailUrl(),
                request.getChannelTitle(),
                request.getDuration(),
                nextPosition);

        // Thêm vào playlist
        playlist.addItem(item);
        playlist.setVideoCount(playlist.getVideoCount() + 1);

        // Cập nhật thumbnail cho playlist nếu đây là video đầu tiên
        if (playlist.getThumbnailUrl() == null || playlist.getThumbnailUrl().isEmpty()) {
            playlist.setThumbnailUrl(request.getThumbnailUrl());
        }

        playlistRepository.save(playlist);
        return playlistItemRepository.save(item);
    }

    /**
     * Xóa video khỏi playlist
     */
    @Transactional
    public void removeFromPlaylist(Long userId, Long playlistId, Long itemId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Playlist playlist = playlistRepository.findByIdAndUser(playlistId, user);
        if (playlist == null) {
            throw new RuntimeException("Playlist not found with id: " + playlistId);
        }

        PlaylistItem item = playlistItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found in playlist"));

        if (!item.getPlaylist().getId().equals(playlistId)) {
            throw new RuntimeException("Item does not belong to this playlist");
        }

        // Cập nhật lại vị trí của các video sau nó
        List<PlaylistItem> itemsToUpdate = playlistItemRepository.findByPlaylistOrderByPositionAsc(playlist);
        for (PlaylistItem otherItem : itemsToUpdate) {
            if (otherItem.getPosition() > item.getPosition()) {
                otherItem.setPosition(otherItem.getPosition() - 1);
                playlistItemRepository.save(otherItem);
            }
        }

        // Cập nhật thumbnail nếu là video đầu tiên
        if (item.getPosition() == 0 && playlist.getVideoCount() > 1) {
            // Tìm video thứ 2 để làm thumbnail mới
            Optional<PlaylistItem> newFirstItem = playlistItemRepository.findByPlaylistAndPosition(playlist, 1);
            if (newFirstItem.isPresent()) {
                playlist.setThumbnailUrl(newFirstItem.get().getThumbnailUrl());
            }
        }

        // Xóa item
        playlistItemRepository.delete(item);

        // Cập nhật số lượng video
        playlist.setVideoCount(playlist.getVideoCount() - 1);
        playlistRepository.save(playlist);
    }

    /**
     * Xóa playlist
     */
    @Transactional
    public void deletePlaylist(Long userId, Long playlistId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Playlist playlist = playlistRepository.findByIdAndUser(playlistId, user);
        if (playlist == null) {
            throw new RuntimeException("Playlist not found with id: " + playlistId);
        }

        playlistRepository.delete(playlist);
    }

    /**
     * Lấy tất cả video trong playlist
     */
    public List<PlaylistItem> getPlaylistItems(Long userId, Long playlistId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Playlist playlist = playlistRepository.findByIdAndUser(playlistId, user);
        if (playlist == null) {
            throw new RuntimeException("Playlist not found with id: " + playlistId);
        }

        return playlistItemRepository.findByPlaylistOrderByPositionAsc(playlist);
    }
}