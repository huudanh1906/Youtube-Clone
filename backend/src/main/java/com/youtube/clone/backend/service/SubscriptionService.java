package com.youtube.clone.backend.service;

import com.youtube.clone.backend.payload.response.SubscriptionResponse;

import java.util.List;

public interface SubscriptionService {
    SubscriptionResponse subscribe(Long subscriberId, String channelId, String channelTitle,
            String channelThumbnailUrl);

    void unsubscribe(Long subscriberId, String channelId);

    List<SubscriptionResponse> getSubscriptionsBySubscriberId(Long subscriberId);

    List<SubscriptionResponse> getSubscribersByChannelId(String channelId);

    boolean isSubscribed(Long subscriberId, String channelId);

    Long countSubscribers(String channelId);

    void updateSubscriberCount(String channelId);
}