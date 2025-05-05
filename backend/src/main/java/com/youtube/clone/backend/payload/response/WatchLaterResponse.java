package com.youtube.clone.backend.payload.response;

import com.youtube.clone.backend.model.WatchLater;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class WatchLaterResponse {
    private Long id;
    private String videoId;
    private String title;
    private String description;
    private String thumbnailUrl;
    private String channelTitle;
    private Long duration;
    private LocalDateTime addedAt;

    public static WatchLaterResponse fromEntity(WatchLater watchLater) {
        WatchLaterResponse response = new WatchLaterResponse();
        response.setId(watchLater.getId());
        response.setVideoId(watchLater.getVideoId());
        response.setTitle(watchLater.getTitle());
        response.setDescription(watchLater.getDescription());
        response.setThumbnailUrl(watchLater.getThumbnailUrl());
        response.setChannelTitle(watchLater.getChannelTitle());
        response.setDuration(watchLater.getDuration());
        response.setAddedAt(watchLater.getAddedAt());
        return response;
    }
}