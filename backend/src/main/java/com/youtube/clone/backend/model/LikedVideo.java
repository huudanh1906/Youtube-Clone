package com.youtube.clone.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "liked_videos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikedVideo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String videoId;

    @Column(nullable = false)
    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    private String thumbnailUrl;

    private String channelTitle;

    @CreationTimestamp
    private LocalDateTime likedAt;

    public LikedVideo(User user, String videoId, String title, String description, String thumbnailUrl,
            String channelTitle) {
        this.user = user;
        this.videoId = videoId;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.channelTitle = channelTitle;
    }
}