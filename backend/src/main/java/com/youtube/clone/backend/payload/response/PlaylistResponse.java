package com.youtube.clone.backend.payload.response;

import com.youtube.clone.backend.model.Playlist;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PlaylistResponse {
    private Long id;
    private String name;
    private String description;
    private String privacy;
    private String thumbnailUrl;
    private Integer videoCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String ownerUsername;

    public static PlaylistResponse fromEntity(Playlist playlist) {
        PlaylistResponse response = new PlaylistResponse();
        response.setId(playlist.getId());
        response.setName(playlist.getName());
        response.setDescription(playlist.getDescription());
        response.setPrivacy(playlist.getPrivacy());
        response.setThumbnailUrl(playlist.getThumbnailUrl());
        response.setVideoCount(playlist.getVideoCount());
        response.setCreatedAt(playlist.getCreatedAt());
        response.setUpdatedAt(playlist.getUpdatedAt());
        response.setOwnerUsername(playlist.getUser().getUsername());
        return response;
    }
}