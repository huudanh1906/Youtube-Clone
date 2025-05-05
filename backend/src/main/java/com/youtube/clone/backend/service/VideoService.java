package com.youtube.clone.backend.service;

import com.youtube.clone.backend.exception.ResourceNotFoundException;
import com.youtube.clone.backend.model.User;
import com.youtube.clone.backend.model.Video;
import com.youtube.clone.backend.payload.request.UploadVideoRequest;
import com.youtube.clone.backend.repository.UserRepository;
import com.youtube.clone.backend.repository.VideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@Service
public class VideoService {

    @Autowired
    private VideoRepository videoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public Video uploadVideo(Long userId, UploadVideoRequest uploadRequest, MultipartFile videoFile) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Store the video file
        String filePath = fileStorageService.storeVideo(videoFile);

        // Generate a unique video ID
        String videoId = UUID.randomUUID().toString().substring(0, 11);

        // Get duration from request or default to 0 if not provided
        Long duration = uploadRequest.getDuration() != null ? uploadRequest.getDuration() : 0L;
        System.out.println("Received video duration from client: " + duration + " seconds");
        
        // Create a new video entity
        Video video = new Video(
                user,
                videoId,
                uploadRequest.getTitle(),
                uploadRequest.getDescription(),
                filePath,
                videoFile.getSize(),
                duration, // Use the duration from request instead of hardcoded 0L
                uploadRequest.getPrivacy());

        Video savedVideo = videoRepository.save(video);
        System.out.println("Saved video with ID: " + videoId + ", duration: " + savedVideo.getDuration() + " seconds");
        
        return savedVideo;
    }

    public Video uploadThumbnail(String videoId, MultipartFile thumbnailFile) {
        Video video = videoRepository.findByVideoId(videoId)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with id: " + videoId));

        String thumbnailPath = fileStorageService.storeThumbnail(thumbnailFile);
        video.setThumbnailUrl(thumbnailPath);

        return videoRepository.save(video);
    }

    public Video getVideoById(String videoId) {
        return videoRepository.findByVideoId(videoId)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with id: " + videoId));
    }

    public List<Video> getUserVideos(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return videoRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Video> getUserPublishedVideos(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return videoRepository.findByUserAndPublishedTrueOrderByCreatedAtDesc(user);
    }

    public Page<Video> getPublicVideos(Pageable pageable) {
        return videoRepository.findByPrivacyAndPublishedTrue("public", pageable);
    }

    public Page<Video> searchVideos(String keyword, Pageable pageable) {
        return videoRepository.findByTitleContainingAndPrivacyAndPublishedTrue(keyword, "public", pageable);
    }

    public Page<Video> getTrendingVideos(Pageable pageable) {
        return videoRepository.findTrendingVideos(pageable);
    }

    public Video updateVideo(String videoId, UploadVideoRequest updateRequest) {
        Video video = videoRepository.findByVideoId(videoId)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with id: " + videoId));

        video.setTitle(updateRequest.getTitle());
        video.setDescription(updateRequest.getDescription());
        video.setPrivacy(updateRequest.getPrivacy());
        
        // Update duration if provided
        if (updateRequest.getDuration() != null) {
            video.setDuration(updateRequest.getDuration());
        }

        return videoRepository.save(video);
    }

    public Video publishVideo(String videoId) {
        Video video = videoRepository.findByVideoId(videoId)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with id: " + videoId));

        video.setPublished(true);
        video.setProcessingStatus("complete");
        System.out.println("Publishing video with ID: " + videoId + ", updating status to complete");
        
        return videoRepository.save(video);
    }

    public void incrementViewCount(String videoId) {
        Video video = videoRepository.findByVideoId(videoId)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with id: " + videoId));

        video.setViewCount(video.getViewCount() + 1);
        videoRepository.save(video);
    }

    public void updateProcessingStatus(String videoId, String status) {
        Video video = videoRepository.findByVideoId(videoId)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with id: " + videoId));

        video.setProcessingStatus(status);
        videoRepository.save(video);
    }

    public void updateVideoDuration(String videoId, Long duration) {
        Video video = videoRepository.findByVideoId(videoId)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with id: " + videoId));

        video.setDuration(duration);
        videoRepository.save(video);
    }

    public void deleteVideo(String videoId, Long userId) {
        Video video = videoRepository.findByVideoId(videoId)
                .orElseThrow(() -> new ResourceNotFoundException("Video not found with id: " + videoId));

        // Check if the user is the owner of the video
        if (!video.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("User is not authorized to delete this video");
        }

        // Delete the video file
        if (video.getFilePath() != null) {
            try {
                fileStorageService.loadVideoAsResource(video.getFilePath()).getFile().delete();
            } catch (Exception e) {
                // Log the error but continue with video deletion
                System.err.println("Error deleting video file: " + e.getMessage());
            }
        }

        // Delete the thumbnail if it exists
        if (video.getThumbnailUrl() != null) {
            try {
                fileStorageService.loadThumbnailAsResource(video.getThumbnailUrl()).getFile().delete();
            } catch (Exception e) {
                // Log the error but continue with video deletion
                System.err.println("Error deleting thumbnail file: " + e.getMessage());
            }
        }

        // Delete the video entity from the database
        videoRepository.delete(video);
    }
}