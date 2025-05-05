package com.youtube.clone.backend.controllers;

import com.youtube.clone.backend.model.WatchLater;
import com.youtube.clone.backend.payload.request.AddToWatchLaterRequest;
import com.youtube.clone.backend.payload.response.WatchLaterResponse;
import com.youtube.clone.backend.security.services.UserDetailsImpl;
import com.youtube.clone.backend.service.WatchLaterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/watch-later")
public class WatchLaterController {

    @Autowired
    private WatchLaterService watchLaterService;

    /**
     * Lấy tất cả video trong danh sách Watch Later của người dùng
     */
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<WatchLaterResponse>> getWatchLaterItems(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<WatchLater> items = watchLaterService.getWatchLaterItems(userDetails.getId());
        List<WatchLaterResponse> responses = items.stream()
                .map(WatchLaterResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    /**
     * Kiểm tra xem một video đã có trong danh sách Watch Later của người dùng chưa
     */
    @GetMapping("/check/{videoId}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<Boolean> isInWatchLater(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable String videoId) {
        boolean isInWatchLater = watchLaterService.isInWatchLater(userDetails.getId(), videoId);
        return ResponseEntity.ok(isInWatchLater);
    }

    /**
     * Thêm video vào danh sách Watch Later
     */
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<WatchLaterResponse> addToWatchLater(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody AddToWatchLaterRequest request) {
        WatchLater item = watchLaterService.addToWatchLater(userDetails.getId(), request);
        return ResponseEntity.ok(WatchLaterResponse.fromEntity(item));
    }

    /**
     * Xóa video khỏi danh sách Watch Later
     */
    @DeleteMapping("/{videoId}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> removeFromWatchLater(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable String videoId) {
        watchLaterService.removeFromWatchLater(userDetails.getId(), videoId);
        return ResponseEntity.ok().build();
    }
}