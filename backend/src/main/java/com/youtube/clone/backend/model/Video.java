package com.youtube.clone.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "videos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Video {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String videoId; // Unique ID for the video (like YouTube's video ID)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    private String thumbnailUrl;

    @Column(nullable = false)
    private String filePath; // Path to the video file on server

    @Column(nullable = false)
    private Long fileSize; // Size in bytes

    @Column(nullable = false)
    private Long duration; // Duration in seconds

    @Column(nullable = false)
    private String privacy = "private"; // private, unlisted, public

    @Column(nullable = false)
    private Integer viewCount = 0;

    @Column(nullable = false)
    private Integer likeCount = 0;

    @Column(nullable = false)
    private Boolean published = false;
    
    private String processingStatus = "pending"; // pending, processing, complete, failed

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Categories, tags, etc. can be added later

    public Video(User user, String videoId, String title, String description, 
                String filePath, Long fileSize, Long duration, String privacy) {
        this.user = user;
        this.videoId = videoId;
        this.title = title;
        this.description = description;
        this.filePath = filePath;
        this.fileSize = fileSize;
        this.duration = duration;
        this.privacy = privacy;
    }
} 