package com.youtube.clone.backend.service;

import com.youtube.clone.backend.model.LikedVideo;
import com.youtube.clone.backend.model.User;
import com.youtube.clone.backend.payload.request.LikeVideoRequest;
import com.youtube.clone.backend.payload.response.LikedVideoResponse;
import com.youtube.clone.backend.repository.LikedVideoRepository;
import com.youtube.clone.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LikedVideoService {

    @Autowired
    private LikedVideoRepository likedVideoRepository;

    @Autowired
    private UserRepository userRepository;

    public List<LikedVideoResponse> getLikedVideos(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        List<LikedVideo> likedVideos = likedVideoRepository.findByUserOrderByLikedAtDesc(user);

        return likedVideos.stream()
                .map(this::mapToLikedVideoResponse)
                .collect(Collectors.toList());
    }

    public LikedVideoResponse likeVideo(String username, LikeVideoRequest likeVideoRequest) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // Check if already liked
        if (likedVideoRepository.existsByUserAndVideoId(user, likeVideoRequest.getVideoId())) {
            throw new RuntimeException("Video already liked");
        }

        LikedVideo likedVideo = new LikedVideo(
                user,
                likeVideoRequest.getVideoId(),
                likeVideoRequest.getTitle(),
                likeVideoRequest.getDescription(),
                likeVideoRequest.getThumbnailUrl(),
                likeVideoRequest.getChannelTitle());

        likedVideo = likedVideoRepository.save(likedVideo);
        return mapToLikedVideoResponse(likedVideo);
    }

    @Transactional
    public void unlikeVideo(String username, String videoId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        likedVideoRepository.deleteByUserAndVideoId(user, videoId);
    }

    public boolean isVideoLiked(String username, String videoId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return likedVideoRepository.existsByUserAndVideoId(user, videoId);
    }

    private LikedVideoResponse mapToLikedVideoResponse(LikedVideo likedVideo) {
        return new LikedVideoResponse(
                likedVideo.getId(),
                likedVideo.getVideoId(),
                likedVideo.getTitle(),
                likedVideo.getDescription(),
                likedVideo.getThumbnailUrl(),
                likedVideo.getChannelTitle(),
                likedVideo.getLikedAt());
    }
}