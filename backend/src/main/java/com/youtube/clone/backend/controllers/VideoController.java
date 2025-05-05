package com.youtube.clone.backend.controllers;

import com.youtube.clone.backend.model.Video;
import com.youtube.clone.backend.payload.request.UploadVideoRequest;
import com.youtube.clone.backend.payload.response.VideoResponse;
import com.youtube.clone.backend.security.CurrentUser;
import com.youtube.clone.backend.security.UserPrincipal;
import com.youtube.clone.backend.security.jwt.JwtUtils;
import com.youtube.clone.backend.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

    @Autowired
    private VideoService videoService;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> uploadVideo(
            @CurrentUser UserPrincipal currentUser,
            @Valid @RequestPart("videoData") UploadVideoRequest videoRequest,
            @RequestPart("file") MultipartFile file,
            HttpServletRequest request) {

        try {
            System.out.println("Processing video upload request");

            // Debug authentication headers
            String authHeader = request.getHeader("Authorization");
            System.out.println("Authorization header: " + authHeader);

            Long userId = null;

            // Extract user ID directly from JWT token if CurrentUser is null
            if (currentUser == null) {
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    String jwt = authHeader.substring(7);
                    try {
                        userId = jwtUtils.getUserIdFromJwtToken(jwt);
                        System.out.println("Extracted user ID from token: " + userId);
                    } catch (Exception e) {
                        System.err.println("Error extracting user ID from token: " + e.getMessage());
                        return ResponseEntity
                                .status(401)
                                .body(new ErrorResponse(
                                        "Authentication failed: Invalid token",
                                        "AuthenticationException"));
                    }
                } else {
                    System.out.println("ERROR: CurrentUser is null - Authentication failed");
                    return ResponseEntity
                            .status(401)
                            .body(new ErrorResponse(
                                    "Authentication failed: User not authenticated properly",
                                    "AuthenticationException"));
                }
            } else {
                userId = currentUser.getId();
                System.out.println("User ID from CurrentUser: " + userId);
            }

            if (userId == null) {
                return ResponseEntity
                        .status(401)
                        .body(new ErrorResponse(
                                "Authentication failed: Could not determine user ID",
                                "AuthenticationException"));
            }

            System.out.println("Video title: " + videoRequest.getTitle());
            System.out.println("File size: " + file.getSize());
            System.out.println("Content type: " + file.getContentType());

            // Use the extracted userId instead of currentUser.getId()
            Video video = videoService.uploadVideo(userId, videoRequest, file);

            URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path("/{videoId}")
                    .buildAndExpand(video.getVideoId())
                    .toUri();

            return ResponseEntity.created(location).body(VideoResponse.fromVideo(video));
        } catch (Exception e) {
            System.err.println("Error in video upload: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                    .status(500)
                    .body(new ErrorResponse(
                            "Video upload failed: " + e.getMessage(),
                            e.getClass().getName()));
        }
    }

    @PostMapping("/{videoId}/thumbnail")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> uploadThumbnail(
            @PathVariable String videoId,
            @RequestPart("file") MultipartFile file,
            HttpServletRequest request) {

        try {
            // Debug authentication headers
            String authHeader = request.getHeader("Authorization");
            System.out.println("Authorization header for thumbnail upload: " + authHeader);

            Video video = videoService.uploadThumbnail(videoId, file);
            return ResponseEntity.ok(VideoResponse.fromVideo(video));
        } catch (Exception e) {
            System.err.println("Error in thumbnail upload: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                    .status(500)
                    .body(new ErrorResponse(
                            "Thumbnail upload failed: " + e.getMessage(),
                            e.getClass().getName()));
        }
    }

    @GetMapping("/{videoId}")
    public ResponseEntity<?> getVideo(@PathVariable String videoId) {
        try {
            System.out.println("Getting video with ID: " + videoId);
            Video video = videoService.getVideoById(videoId);

            // Increment view count when the video is accessed
            videoService.incrementViewCount(videoId);

            VideoResponse response = VideoResponse.fromVideo(video);
            System.out.println("Returning video: " + response.getTitle() + ", FilePath: " + response.getFilePath());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error getting video: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                    .status(500)
                    .body(new ErrorResponse(
                            "Failed to get video: " + e.getMessage(),
                            e.getClass().getName()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserVideos(@PathVariable Long userId) {
        List<Video> videos = videoService.getUserPublishedVideos(userId);
        List<VideoResponse> videoResponses = videos.stream()
                .map(VideoResponse::fromVideo)
                .collect(Collectors.toList());

        return ResponseEntity.ok(videoResponses);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getMyVideos(
            @CurrentUser UserPrincipal currentUser,
            HttpServletRequest request) {

        try {
            System.out.println("Processing get my videos request");

            // Debug authentication headers
            String authHeader = request.getHeader("Authorization");
            System.out.println("Authorization header for get my videos: " + authHeader);

            Long userId = null;

            // Extract user ID directly from JWT token if CurrentUser is null
            if (currentUser == null) {
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    String jwt = authHeader.substring(7);
                    try {
                        userId = jwtUtils.getUserIdFromJwtToken(jwt);
                        System.out.println("Extracted user ID from token: " + userId);
                    } catch (Exception e) {
                        System.err.println("Error extracting user ID from token: " + e.getMessage());
                        return ResponseEntity
                                .status(401)
                                .body(new ErrorResponse(
                                        "Authentication failed: Invalid token",
                                        "AuthenticationException"));
                    }
                } else {
                    System.out.println("ERROR: CurrentUser is null - Authentication failed");
                    return ResponseEntity
                            .status(401)
                            .body(new ErrorResponse(
                                    "Authentication failed: User not authenticated properly",
                                    "AuthenticationException"));
                }
            } else {
                userId = currentUser.getId();
                System.out.println("User ID from CurrentUser: " + userId);
            }

            if (userId == null) {
                return ResponseEntity
                        .status(401)
                        .body(new ErrorResponse(
                                "Authentication failed: Could not determine user ID",
                                "AuthenticationException"));
            }

            List<Video> videos = videoService.getUserVideos(userId);
            List<VideoResponse> videoResponses = videos.stream()
                    .map(VideoResponse::fromVideo)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(videoResponses);
        } catch (Exception e) {
            System.err.println("Error getting user videos: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                    .status(500)
                    .body(new ErrorResponse(
                            "Failed to get user videos: " + e.getMessage(),
                            e.getClass().getName()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getPublicVideos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Video> videos = videoService.getPublicVideos(pageable);
        Page<VideoResponse> videoResponses = videos.map(VideoResponse::fromVideo);

        return ResponseEntity.ok(videoResponses);
    }

    @GetMapping("/trending")
    public ResponseEntity<?> getTrendingVideos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Video> videos = videoService.getTrendingVideos(pageable);
        Page<VideoResponse> videoResponses = videos.map(VideoResponse::fromVideo);

        return ResponseEntity.ok(videoResponses);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchVideos(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<Video> videos = videoService.searchVideos(query, pageable);
        Page<VideoResponse> videoResponses = videos.map(VideoResponse::fromVideo);

        return ResponseEntity.ok(videoResponses);
    }

    @PutMapping("/{videoId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateVideo(
            @PathVariable String videoId,
            @Valid @RequestBody UploadVideoRequest updateRequest) {

        Video video = videoService.updateVideo(videoId, updateRequest);
        return ResponseEntity.ok(VideoResponse.fromVideo(video));
    }

    @PostMapping("/{videoId}/publish")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> publishVideo(
            @PathVariable String videoId,
            HttpServletRequest request) {

        try {
            // Debug authentication headers
            String authHeader = request.getHeader("Authorization");
            System.out.println("Authorization header for video publish: " + authHeader);

            Video video = videoService.publishVideo(videoId);
            return ResponseEntity.ok(VideoResponse.fromVideo(video));
        } catch (Exception e) {
            System.err.println("Error in video publish: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                    .status(500)
                    .body(new ErrorResponse(
                            "Video publish failed: " + e.getMessage(),
                            e.getClass().getName()));
        }
    }

    @GetMapping("/{videoId}/view")
    public ResponseEntity<?> incrementViewCount(@PathVariable String videoId) {
        try {
            videoService.incrementViewCount(videoId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error incrementing view count: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                    .status(500)
                    .body(new ErrorResponse(
                            "View count increment failed: " + e.getMessage(),
                            e.getClass().getName()));
        }
    }

    @DeleteMapping("/{videoId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteVideo(
            @PathVariable String videoId,
            @CurrentUser UserPrincipal currentUser,
            HttpServletRequest request) {

        try {
            // Debug authentication headers
            String authHeader = request.getHeader("Authorization");
            System.out.println("Authorization header for video deletion: " + authHeader);

            Long userId = null;

            // Extract user ID directly from JWT token if CurrentUser is null
            if (currentUser == null) {
                if (authHeader != null && authHeader.startsWith("Bearer ")) {
                    String jwt = authHeader.substring(7);
                    try {
                        userId = jwtUtils.getUserIdFromJwtToken(jwt);
                        System.out.println("Extracted user ID from token: " + userId);
                    } catch (Exception e) {
                        System.err.println("Error extracting user ID from token: " + e.getMessage());
                        return ResponseEntity
                                .status(401)
                                .body(new ErrorResponse(
                                        "Authentication failed: Invalid token",
                                        "AuthenticationException"));
                    }
                } else {
                    System.out.println("ERROR: CurrentUser is null - Authentication failed");
                    return ResponseEntity
                            .status(401)
                            .body(new ErrorResponse(
                                    "Authentication failed: User not authenticated properly",
                                    "AuthenticationException"));
                }
            } else {
                userId = currentUser.getId();
                System.out.println("User ID from CurrentUser: " + userId);
            }

            if (userId == null) {
                return ResponseEntity
                        .status(401)
                        .body(new ErrorResponse(
                                "Authentication failed: Could not determine user ID",
                                "AuthenticationException"));
            }

            videoService.deleteVideo(videoId, userId);
            return ResponseEntity.ok().body(new MessageResponse("Video deleted successfully"));
        } catch (Exception e) {
            System.err.println("Error in video deletion: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity
                    .status(500)
                    .body(new ErrorResponse(
                            "Video deletion failed: " + e.getMessage(),
                            e.getClass().getName()));
        }
    }
}

class ErrorResponse {
    private String message;
    private String exceptionType;
    private long timestamp;

    public ErrorResponse(String message, String exceptionType) {
        this.message = message;
        this.exceptionType = exceptionType;
        this.timestamp = System.currentTimeMillis();
    }

    public String getMessage() {
        return message;
    }

    public String getExceptionType() {
        return exceptionType;
    }

    public long getTimestamp() {
        return timestamp;
    }
}

class MessageResponse {
    private String message;
    private long timestamp;

    public MessageResponse(String message) {
        this.message = message;
        this.timestamp = System.currentTimeMillis();
    }

    public String getMessage() {
        return message;
    }

    public long getTimestamp() {
        return timestamp;
    }
}