package com.youtube.clone.backend.payload.request;

import lombok.Data;

@Data
public class CreatePlaylistRequest {
    private String name;
    private String description;
    private String privacy = "private"; // Mặc định là private
}