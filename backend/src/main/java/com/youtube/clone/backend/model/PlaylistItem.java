package com.youtube.clone.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "playlist_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaylistItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "playlist_id", nullable = false)
    private Playlist playlist;

    // Video từ YouTube không lưu trong DB nên không có quan hệ OneToMany
    @Column(nullable = false)
    private String videoId;

    // Để biết video này ở vị trí nào trong playlist
    private Integer position;

    // Lưu lại thông tin cơ bản của video để hiển thị mà không cần gọi API YouTube
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

    public PlaylistItem(Playlist playlist, String videoId, String title, String description,
            String thumbnailUrl, String channelTitle, Long duration, Integer position) {
        this.playlist = playlist;
        this.videoId = videoId;
        this.title = title;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.channelTitle = channelTitle;
        this.duration = duration;
        this.position = position;
    }
}