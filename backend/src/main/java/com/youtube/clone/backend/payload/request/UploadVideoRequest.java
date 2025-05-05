package com.youtube.clone.backend.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UploadVideoRequest {
    @NotBlank
    @Size(min = 3, max = 100)
    private String title;

    @Size(max = 5000)
    private String description;

    private String privacy = "private"; // private, unlisted, public

    private String[] tags;

    private String category;
    
    private Long duration; // Duration in seconds
}