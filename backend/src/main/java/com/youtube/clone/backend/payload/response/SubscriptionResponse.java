package com.youtube.clone.backend.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionResponse {
    private Long id;
    private Long subscriberId;
    private String subscriberUsername;
    private String subscriberProfileImageUrl;
    private String channelId;
    private String channelTitle;
    private String channelThumbnailUrl;
    private LocalDateTime subscribedAt;
}