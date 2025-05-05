package com.youtube.clone.backend.payload.request;

import lombok.Data;

@Data
public class AddToHistoryRequest {
    private String videoId;
    private String title;
    private String description;
    private String thumbnailUrl;
    private String channelTitle;
    private Long duration; // Video duration in seconds
}