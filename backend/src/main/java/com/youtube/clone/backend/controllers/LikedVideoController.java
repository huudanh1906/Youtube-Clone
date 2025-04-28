package com.youtube.clone.backend.controllers;

import com.youtube.clone.backend.payload.request.LikeVideoRequest;
import com.youtube.clone.backend.payload.response.LikedVideoResponse;
import com.youtube.clone.backend.payload.response.MessageResponse;
import com.youtube.clone.backend.service.LikedVideoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600, allowedHeaders = "*")
@RestController
@RequestMapping("/videos/likes")
public class LikedVideoController {

    @Autowired
    private LikedVideoService likedVideoService;

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<LikedVideoResponse>> getLikedVideos(@AuthenticationPrincipal UserDetails userDetails) {
        List<LikedVideoResponse> likedVideos = likedVideoService.getLikedVideos(userDetails.getUsername());
        return ResponseEntity.ok(likedVideos);
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> likeVideo(@AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody LikeVideoRequest likeVideoRequest) {
        try {
            LikedVideoResponse likedVideo = likedVideoService.likeVideo(userDetails.getUsername(), likeVideoRequest);
            return ResponseEntity.ok(likedVideo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{videoId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> unlikeVideo(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String videoId) {
        try {
            likedVideoService.unlikeVideo(userDetails.getUsername(), videoId);
            return ResponseEntity.ok(new MessageResponse("Video unliked successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping("/{videoId}/check")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> checkIfVideoLiked(@AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String videoId) {
        boolean isLiked = likedVideoService.isVideoLiked(userDetails.getUsername(), videoId);
        return ResponseEntity.ok(isLiked);
    }
}