package com.youtube.clone.backend.payload.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionRequest {
    @NotNull
    private String channelId;

    private String channelTitle;

    private String channelThumbnailUrl;
}