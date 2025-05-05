package com.youtube.clone.backend.payload.response;

import com.youtube.clone.backend.model.PlaylistItem;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PlaylistItemResponse {
    private Long id;
    private Long playlistId;
    private String videoId;
    private String title;
    private String description;
    private String thumbnailUrl;
    private String channelTitle;
    private Long duration;
    private Integer position;
    private LocalDateTime addedAt;

    public static PlaylistItemResponse fromEntity(PlaylistItem item) {
        PlaylistItemResponse response = new PlaylistItemResponse();
        response.setId(item.getId());
        response.setPlaylistId(item.getPlaylist().getId());
        response.setVideoId(item.getVideoId());
        response.setTitle(item.getTitle());
        response.setDescription(item.getDescription());
        response.setThumbnailUrl(item.getThumbnailUrl());
        response.setChannelTitle(item.getChannelTitle());
        response.setDuration(item.getDuration());
        response.setPosition(item.getPosition());
        response.setAddedAt(item.getAddedAt());
        return response;
    }
}