package com.youtube.clone.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "watch_later", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "video_id" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WatchLater {
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

    private Long duration; // Thời lượng của video tính bằng giây

    @CreationTimestamp
    private LocalDateTime addedAt;

    public WatchLater(User user, String videoId, String title, String description,
            String thumbnailUrl, String channelTitle, Long duration) {
        this.user = user;
        this.videoId = videoId;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.channelTitle = channelTitle;
        this.duration = duration;
    }
}