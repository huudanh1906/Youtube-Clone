package com.youtube.clone.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "history")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class History {
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
    private LocalDateTime firstViewedAt; // Khi nào xem lần đầu

    @UpdateTimestamp
    private LocalDateTime lastViewedAt; // Lần xem gần nhất

    public History(User user, String videoId, String title, String description, String thumbnailUrl,
            String channelTitle, Long duration) {
        this.user = user;
        this.videoId = videoId;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.channelTitle = channelTitle;
        this.duration = duration;
    }
}