package com.youtube.clone.backend.payload.request;

import lombok.Data;

@Data
public class AddToWatchLaterRequest {
    private String videoId;
    private String title;
    private String description;
    private String thumbnailUrl;
    private String channelTitle;
    private Long duration; // Thời lượng video tính bằng giây
}