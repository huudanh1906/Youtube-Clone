package com.youtube.clone.backend.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikedVideoResponse {
    private Long id;
    private String videoId;
    private String title;
    private String description;
    private String thumbnailUrl;
    private String channelTitle;
    private LocalDateTime likedAt;
}