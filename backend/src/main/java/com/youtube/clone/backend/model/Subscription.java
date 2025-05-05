package com.youtube.clone.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "subscriber_id", "channel_id" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subscriber_id", nullable = false)
    private User subscriber;

    @Column(name = "channel_id", nullable = false)
    private String channelId;

    @Column(name = "channel_title")
    private String channelTitle;

    @Column(name = "channel_thumbnail_url")
    private String channelThumbnailUrl;

    @CreationTimestamp
    @Column(name = "subscribed_at")
    private LocalDateTime subscribedAt;

    public Subscription(User subscriber, String channelId) {
        this.subscriber = subscriber;
        this.channelId = channelId;
    }

    public Subscription(User subscriber, String channelId, String channelTitle, String channelThumbnailUrl) {
        this.subscriber = subscriber;
        this.channelId = channelId;
        this.channelTitle = channelTitle;
        this.channelThumbnailUrl = channelThumbnailUrl;
    }
}