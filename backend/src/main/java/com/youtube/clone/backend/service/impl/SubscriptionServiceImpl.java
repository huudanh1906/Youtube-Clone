package com.youtube.clone.backend.service.impl;

import com.youtube.clone.backend.model.Subscription;
import com.youtube.clone.backend.model.User;
import com.youtube.clone.backend.payload.response.SubscriptionResponse;
import com.youtube.clone.backend.repository.SubscriptionRepository;
import com.youtube.clone.backend.repository.UserRepository;
import com.youtube.clone.backend.service.SubscriptionService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubscriptionServiceImpl implements SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public SubscriptionResponse subscribe(Long subscriberId, String channelId, String channelTitle,
            String channelThumbnailUrl) {
        User subscriber = userRepository.findById(subscriberId)
                .orElseThrow(() -> new RuntimeException("Subscriber not found"));

        if (subscriptionRepository.existsBySubscriberIdAndChannelId(subscriberId, channelId)) {
            throw new RuntimeException("Already subscribed to this channel");
        }

        Subscription subscription = new Subscription(subscriber, channelId, channelTitle, channelThumbnailUrl);
        Subscription savedSubscription = subscriptionRepository.save(subscription);

        return mapToResponse(savedSubscription);
    }

    @Override
    @Transactional
    public void unsubscribe(Long subscriberId, String channelId) {
        if (!subscriptionRepository.existsBySubscriberIdAndChannelId(subscriberId, channelId)) {
            throw new RuntimeException("Not subscribed to this channel");
        }

        subscriptionRepository.deleteBySubscriberIdAndChannelId(subscriberId, channelId);
    }

    @Override
    public List<SubscriptionResponse> getSubscriptionsBySubscriberId(Long subscriberId) {
        List<Subscription> subscriptions = subscriptionRepository.findBySubscriberId(subscriberId);
        return subscriptions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SubscriptionResponse> getSubscribersByChannelId(String channelId) {
        List<Subscription> subscriptions = subscriptionRepository.findByChannelId(channelId);
        return subscriptions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isSubscribed(Long subscriberId, String channelId) {
        return subscriptionRepository.existsBySubscriberIdAndChannelId(subscriberId, channelId);
    }

    @Override
    public Long countSubscribers(String channelId) {
        return subscriptionRepository.countByChannelId(channelId);
    }

    @Override
    @Transactional
    public void updateSubscriberCount(String channelId) {
        // Không cần cập nhật vì không còn User entity liên kết trực tiếp
        // Phương thức này có thể được sử dụng để cập nhật thông tin khác trong tương
        // lai
    }

    private SubscriptionResponse mapToResponse(Subscription subscription) {
        return new SubscriptionResponse(
                subscription.getId(),
                subscription.getSubscriber().getId(),
                subscription.getSubscriber().getUsername(),
                subscription.getSubscriber().getProfileImageUrl(),
                subscription.getChannelId(),
                subscription.getChannelTitle(),
                subscription.getChannelThumbnailUrl(),
                subscription.getSubscribedAt());
    }
}