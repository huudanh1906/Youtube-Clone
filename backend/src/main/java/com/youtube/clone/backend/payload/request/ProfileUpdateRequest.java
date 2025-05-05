package com.youtube.clone.backend.payload.request;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String name;
    private String description;
    private String location;
    private String website;
} 