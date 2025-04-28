package com.youtube.clone.backend.payload.request;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;

@Data
public class LikeVideoRequest {
    @NotBlank
    private String videoId;

    @NotBlank
    private String title;

    private String description;

    private String thumbnailUrl;

    private String channelTitle;
}