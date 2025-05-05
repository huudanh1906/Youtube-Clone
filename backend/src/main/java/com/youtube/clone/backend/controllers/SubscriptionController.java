package com.youtube.clone.backend.controllers;

import com.youtube.clone.backend.payload.request.SubscriptionRequest;
import com.youtube.clone.backend.payload.response.MessageResponse;
import com.youtube.clone.backend.payload.response.SubscriptionResponse;
import com.youtube.clone.backend.security.jwt.JwtUtils;
import com.youtube.clone.backend.service.SubscriptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> subscribe(@Valid @RequestBody SubscriptionRequest subscriptionRequest,
            @RequestHeader("Authorization") String token) {
        try {
            Long subscriberId = jwtUtils.getUserIdFromJwtToken(token.substring(7));
            SubscriptionResponse subscription = subscriptionService.subscribe(subscriberId,
                    subscriptionRequest.getChannelId(),
                    subscriptionRequest.getChannelTitle(),
                    subscriptionRequest.getChannelThumbnailUrl());
            return ResponseEntity.ok(subscription);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{channelId}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> unsubscribe(@PathVariable String channelId,
            @RequestHeader("Authorization") String token) {
        try {
            Long subscriberId = jwtUtils.getUserIdFromJwtToken(token.substring(7));
            subscriptionService.unsubscribe(subscriberId, channelId);
            return ResponseEntity.ok(new MessageResponse("Unsubscribed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/my-subscriptions")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<SubscriptionResponse>> getMySubscriptions(@RequestHeader("Authorization") String token) {
        Long userId = jwtUtils.getUserIdFromJwtToken(token.substring(7));
        List<SubscriptionResponse> subscriptions = subscriptionService.getSubscriptionsBySubscriberId(userId);
        return ResponseEntity.ok(subscriptions);
    }

    @GetMapping("/subscribers/{channelId}")
    public ResponseEntity<List<SubscriptionResponse>> getChannelSubscribers(@PathVariable String channelId) {
        List<SubscriptionResponse> subscribers = subscriptionService.getSubscribersByChannelId(channelId);
        return ResponseEntity.ok(subscribers);
    }

    @GetMapping("/check/{channelId}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Boolean> checkSubscription(@PathVariable String channelId,
            @RequestHeader("Authorization") String token) {
        Long subscriberId = jwtUtils.getUserIdFromJwtToken(token.substring(7));
        boolean isSubscribed = subscriptionService.isSubscribed(subscriberId, channelId);
        return ResponseEntity.ok(isSubscribed);
    }

    @GetMapping("/count/{channelId}")
    public ResponseEntity<Long> countSubscribers(@PathVariable String channelId) {
        Long count = subscriptionService.countSubscribers(channelId);
        return ResponseEntity.ok(count);
    }
}