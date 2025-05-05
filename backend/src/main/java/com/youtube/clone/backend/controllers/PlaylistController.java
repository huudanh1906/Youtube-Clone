package com.youtube.clone.backend.controllers;

import com.youtube.clone.backend.model.Playlist;
import com.youtube.clone.backend.model.PlaylistItem;
import com.youtube.clone.backend.payload.request.AddToPlaylistRequest;
import com.youtube.clone.backend.payload.request.CreatePlaylistRequest;
import com.youtube.clone.backend.payload.response.PlaylistItemResponse;
import com.youtube.clone.backend.payload.response.PlaylistResponse;
import com.youtube.clone.backend.security.services.UserDetailsImpl;
import com.youtube.clone.backend.service.PlaylistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/playlists")
public class PlaylistController {

    @Autowired
    private PlaylistService playlistService;

    /**
     * Lấy tất cả playlist của người dùng
     */
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<PlaylistResponse>> getUserPlaylists(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Playlist> playlists = playlistService.getUserPlaylists(userDetails.getId());
        List<PlaylistResponse> responses = playlists.stream()
                .map(PlaylistResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    /**
     * Lấy chi tiết một playlist
     */
    @GetMapping("/{playlistId}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<PlaylistResponse> getPlaylistById(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long playlistId) {
        Playlist playlist = playlistService.getPlaylistById(userDetails.getId(), playlistId);
        return ResponseEntity.ok(PlaylistResponse.fromEntity(playlist));
    }

    /**
     * Lấy tất cả video trong playlist
     */
    @GetMapping("/{playlistId}/items")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<PlaylistItemResponse>> getPlaylistItems(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long playlistId) {
        List<PlaylistItem> items = playlistService.getPlaylistItems(userDetails.getId(), playlistId);
        List<PlaylistItemResponse> responses = items.stream()
                .map(PlaylistItemResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    /**
     * Tạo playlist mới
     */
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<PlaylistResponse> createPlaylist(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody CreatePlaylistRequest request) {
        Playlist playlist = playlistService.createPlaylist(userDetails.getId(), request);
        return ResponseEntity.ok(PlaylistResponse.fromEntity(playlist));
    }

    /**
     * Thêm video vào playlist
     */
    @PostMapping("/{playlistId}/items")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<PlaylistItemResponse> addToPlaylist(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long playlistId,
            @RequestBody AddToPlaylistRequest request) {
        PlaylistItem item = playlistService.addToPlaylist(userDetails.getId(), playlistId, request);
        return ResponseEntity.ok(PlaylistItemResponse.fromEntity(item));
    }

    /**
     * Xóa video khỏi playlist
     */
    @DeleteMapping("/{playlistId}/items/{itemId}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> removeFromPlaylist(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long playlistId,
            @PathVariable Long itemId) {
        playlistService.removeFromPlaylist(userDetails.getId(), playlistId, itemId);
        return ResponseEntity.ok().build();
    }

    /**
     * Xóa playlist
     */
    @DeleteMapping("/{playlistId}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> deletePlaylist(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long playlistId) {
        playlistService.deletePlaylist(userDetails.getId(), playlistId);
        return ResponseEntity.ok().build();
    }
}