package com.youtube.clone.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "playlists")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Playlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    private String description;

    // Chế độ riêng tư (public, private, unlisted)
    @Column(nullable = false)
    private String privacy = "private";

    // Thumbnail được chọn từ video đầu tiên hoặc do user upload
    private String thumbnailUrl;

    @OneToMany(mappedBy = "playlist", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlaylistItem> items = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Tổng số lượng video trong playlist
    @Column(nullable = false)
    private Integer videoCount = 0;

    // Constructor
    public Playlist(User user, String name, String description, String privacy) {
        this.user = user;
        this.name = name;
        this.description = description;
        this.privacy = privacy;
    }

    // Helper method để thêm item vào playlist
    public void addItem(PlaylistItem item) {
        items.add(item);
        item.setPlaylist(this);
        this.videoCount = items.size();
    }

    // Helper method để xóa item khỏi playlist
    public void removeItem(PlaylistItem item) {
        items.remove(item);
        item.setPlaylist(null);
        this.videoCount = items.size();
    }
}