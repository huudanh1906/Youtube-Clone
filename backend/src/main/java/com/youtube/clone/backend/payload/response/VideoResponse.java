package com.youtube.clone.backend.payload.response;

import com.youtube.clone.backend.model.Video;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class VideoResponse {
    private Long id;
    private String videoId;
    private String title;
    private String description;
    private String thumbnailUrl;
    private String filePath;
    private UserSummary user;
    private Long duration;
    private String privacy;
    private Integer viewCount;
    private Integer likeCount;
    private boolean published;
    private String processingStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static VideoResponse fromVideo(Video video) {
        VideoResponse videoResponse = new VideoResponse();
        videoResponse.setId(video.getId());
        videoResponse.setVideoId(video.getVideoId());
        videoResponse.setTitle(video.getTitle());
        videoResponse.setDescription(video.getDescription());
        videoResponse.setThumbnailUrl(video.getThumbnailUrl());
        videoResponse.setFilePath(video.getFilePath());

        if (video.getUser() != null) {
            UserSummary userSummary = new UserSummary(
                    video.getUser().getId(),
                    video.getUser().getUsername(),
                    video.getUser().getName());
            videoResponse.setUser(userSummary);
        }

        videoResponse.setDuration(video.getDuration());
        videoResponse.setPrivacy(video.getPrivacy());
        videoResponse.setViewCount(video.getViewCount());
        videoResponse.setLikeCount(video.getLikeCount());
        videoResponse.setPublished(video.getPublished());
        videoResponse.setProcessingStatus(video.getProcessingStatus());
        videoResponse.setCreatedAt(video.getCreatedAt());
        videoResponse.setUpdatedAt(video.getUpdatedAt());

        return videoResponse;
    }
}