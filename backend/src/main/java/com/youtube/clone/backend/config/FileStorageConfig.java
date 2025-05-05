package com.youtube.clone.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "file.storage")
public class FileStorageConfig {
    private String uploadDir;
    private String thumbnailDir;
    private long maxFileSize; // in bytes
    private String[] allowedFileTypes; // e.g. video/mp4, video/webm

    public String getUploadDir() {
        return uploadDir;
    }

    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }

    public String getThumbnailDir() {
        return thumbnailDir;
    }

    public void setThumbnailDir(String thumbnailDir) {
        this.thumbnailDir = thumbnailDir;
    }

    public long getMaxFileSize() {
        return maxFileSize;
    }

    public void setMaxFileSize(long maxFileSize) {
        this.maxFileSize = maxFileSize;
    }

    public String[] getAllowedFileTypes() {
        return allowedFileTypes;
    }

    public void setAllowedFileTypes(String[] allowedFileTypes) {
        this.allowedFileTypes = allowedFileTypes;
    }
}