package com.youtube.clone.backend.repository;

import com.youtube.clone.backend.model.Subscription;
import com.youtube.clone.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findBySubscriberId(Long subscriberId);

    List<Subscription> findByChannelId(String channelId);

    Optional<Subscription> findBySubscriberIdAndChannelId(Long subscriberId, String channelId);

    boolean existsBySubscriberIdAndChannelId(Long subscriberId, String channelId);

    void deleteBySubscriberIdAndChannelId(Long subscriberId, String channelId);

    @Query("SELECT COUNT(s) FROM Subscription s WHERE s.channelId = :channelId")
    Long countByChannelId(String channelId);
}