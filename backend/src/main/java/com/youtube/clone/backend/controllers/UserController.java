package com.youtube.clone.backend.controllers;

import com.youtube.clone.backend.model.User;
import com.youtube.clone.backend.payload.request.ProfileUpdateRequest;
import com.youtube.clone.backend.payload.response.MessageResponse;
import com.youtube.clone.backend.repository.UserRepository;
import com.youtube.clone.backend.security.CurrentUser;
import com.youtube.clone.backend.security.UserPrincipal;
import com.youtube.clone.backend.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;

@CrossOrigin(origins = "*", maxAge = 3600, allowedHeaders = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger LOGGER = Logger.getLogger(UserController.class.getName());

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    private final String uploadDir = "uploads/avatars/";
    private final String bannerDir = "uploads/banners/";
    
    @PostConstruct
    public void init() {
        // Create upload directories if they don't exist
        createDirectoryIfNotExists(uploadDir);
        createDirectoryIfNotExists(bannerDir);
    }
    
    private void createDirectoryIfNotExists(String dirPath) {
        File directory = new File(dirPath);
        if (!directory.exists()) {
            boolean created = directory.mkdirs();
            if (created) {
                LOGGER.info("Created directory: " + dirPath);
            } else {
                LOGGER.warning("Failed to create directory: " + dirPath);
            }
        }
    }

    /**
     * Update user profile
     */
    @PutMapping(
        value = "/{userId}/profile",
        consumes = {"application/json"}
    )
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateProfile(
            @PathVariable Long userId,
            @RequestBody ProfileUpdateRequest profileUpdateRequest,
            HttpServletRequest request) {

        LOGGER.info("Received profile update request for user ID: " + userId);
        
        // Get token from request header
        String authHeader = request.getHeader("Authorization");
        LOGGER.info("Authorization header: " + authHeader);
        
        Long tokenUserId = null;
        
        // Extract user ID from JWT token
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            try {
                tokenUserId = jwtUtils.getUserIdFromJwtToken(jwt);
                LOGGER.info("User ID extracted from token: " + tokenUserId);
            } catch (Exception e) {
                LOGGER.log(Level.SEVERE, "Error extracting user ID from token", e);
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Invalid authentication token"));
            }
        } else {
            LOGGER.warning("No authorization header found or it does not start with 'Bearer '");
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Authentication token not provided"));
        }
        
        if (tokenUserId == null) {
            LOGGER.warning("Could not extract user ID from token");
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: User not authenticated properly"));
        }
        
        LOGGER.info("Authenticated user ID: " + tokenUserId);
        LOGGER.info("Request data: " + profileUpdateRequest.toString());

        if (!userId.equals(tokenUserId)) {
            LOGGER.warning("User ID mismatch - requested: " + userId + ", from token: " + tokenUserId);
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: You can only update your own profile!"));
        }

        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Error: User not found."));

            LOGGER.info("User found in database: " + user.getUsername());

            // Update profile information
            if (StringUtils.hasText(profileUpdateRequest.getName())) {
                LOGGER.info("Updating name field (note: not currently stored separately)");
                // For now, we don't have a separate name field, 
                // but you could add it to the User model
            }

            if (profileUpdateRequest.getDescription() != null) {
                LOGGER.info("Updating description: " + profileUpdateRequest.getDescription());
                user.setChannelDescription(profileUpdateRequest.getDescription());
            }

            if (profileUpdateRequest.getLocation() != null) {
                LOGGER.info("Updating location: " + profileUpdateRequest.getLocation());
                user.setLocation(profileUpdateRequest.getLocation());
            }

            if (profileUpdateRequest.getWebsite() != null) {
                LOGGER.info("Updating website: " + profileUpdateRequest.getWebsite());
                user.setWebsite(profileUpdateRequest.getWebsite());
            }

            LOGGER.info("Saving updated user to database");
            User savedUser = userRepository.save(user);
            LOGGER.info("User saved successfully with ID: " + savedUser.getId());

            return ResponseEntity.ok(new MessageResponse("Profile updated successfully!"));
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error updating profile", e);
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Upload avatar image
     */
    @PostMapping("/{userId}/avatar")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> uploadAvatar(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) {

        LOGGER.info("Received avatar upload request for user ID: " + userId);
        
        // Get token from request header
        String authHeader = request.getHeader("Authorization");
        LOGGER.info("Authorization header: " + authHeader);
        
        Long tokenUserId = null;
        
        // Extract user ID from JWT token
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            try {
                tokenUserId = jwtUtils.getUserIdFromJwtToken(jwt);
                LOGGER.info("User ID extracted from token: " + tokenUserId);
            } catch (Exception e) {
                LOGGER.log(Level.SEVERE, "Error extracting user ID from token", e);
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Invalid authentication token"));
            }
        } else {
            LOGGER.warning("No authorization header found or it does not start with 'Bearer '");
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Authentication token not provided"));
        }
        
        if (tokenUserId == null) {
            LOGGER.warning("Could not extract user ID from token");
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: User not authenticated properly"));
        }

        if (!userId.equals(tokenUserId)) {
            LOGGER.warning("User ID mismatch - requested: " + userId + ", from token: " + tokenUserId);
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: You can only update your own avatar!"));
        }

        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Error: User not found."));

            LOGGER.info("User found in database: " + user.getUsername());

            // Create upload directory if it doesn't exist
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Generate unique filename
            String fileName = userId + "_" + UUID.randomUUID().toString() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
            Path targetLocation = Paths.get(uploadDir + fileName);

            // Save the file
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Update user profile image URL
            user.setProfileImageUrl("/api/users/" + userId + "/avatar?v=" + System.currentTimeMillis());
            userRepository.save(user);

            return ResponseEntity.ok(new MessageResponse("Avatar uploaded successfully!"));
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Error uploading avatar", e);
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Could not upload the avatar: " + e.getMessage()));
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Unexpected error", e);
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Upload banner image
     */
    @PostMapping("/{userId}/banner")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> uploadBanner(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) {

        LOGGER.info("Received banner upload request for user ID: " + userId);
        
        // Get token from request header
        String authHeader = request.getHeader("Authorization");
        LOGGER.info("Authorization header: " + authHeader);
        
        Long tokenUserId = null;
        
        // Extract user ID from JWT token
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            try {
                tokenUserId = jwtUtils.getUserIdFromJwtToken(jwt);
                LOGGER.info("User ID extracted from token: " + tokenUserId);
            } catch (Exception e) {
                LOGGER.log(Level.SEVERE, "Error extracting user ID from token", e);
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Invalid authentication token"));
            }
        } else {
            LOGGER.warning("No authorization header found or it does not start with 'Bearer '");
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Authentication token not provided"));
        }
        
        if (tokenUserId == null) {
            LOGGER.warning("Could not extract user ID from token");
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: User not authenticated properly"));
        }

        if (!userId.equals(tokenUserId)) {
            LOGGER.warning("User ID mismatch - requested: " + userId + ", from token: " + tokenUserId);
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: You can only update your own banner!"));
        }

        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Error: User not found."));

            LOGGER.info("User found in database: " + user.getUsername());

            // Create banner directory if it doesn't exist
            File directory = new File(bannerDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Generate unique filename
            String fileName = userId + "_" + UUID.randomUUID().toString() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
            Path targetLocation = Paths.get(bannerDir + fileName);

            // Save the file
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Update banner image URL in the user model
            user.setBannerImageUrl("/api/users/" + userId + "/banner?v=" + System.currentTimeMillis());
            userRepository.save(user);

            return ResponseEntity.ok(new MessageResponse("Banner uploaded successfully!"));
        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Error uploading banner", e);
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Could not upload the banner: " + e.getMessage()));
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Unexpected error", e);
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Get user profile
     */
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Error: User not found."));

            // Return user profile information (excluding sensitive data)
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    /**
     * Get avatar image
     */
    @GetMapping("/{userId}/avatar")
    public ResponseEntity<?> getAvatar(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Error: User not found."));
            
            // Nếu người dùng không có avatar, trả về ảnh mặc định hoặc 404
            if (user.getProfileImageUrl() == null) {
                return ResponseEntity.notFound().build();
            }
            
            LOGGER.info("Looking for avatar for user ID: " + userId);
            LOGGER.info("Profile image URL: " + user.getProfileImageUrl());
            
            // Tìm file avatar mới nhất cho người dùng này
            File directory = new File(uploadDir);
            File[] files = directory.listFiles();
            
            if (files != null && files.length > 0) {
                // Tìm file mới nhất
                File latestFile = null;
                for (File file : files) {
                    if (file.isFile()) {
                        LOGGER.info("Found file: " + file.getName());
                        // Ưu tiên file có prefix là userId
                        if (file.getName().startsWith(userId + "_")) {
                            if (latestFile == null || file.lastModified() > latestFile.lastModified()) {
                                latestFile = file;
                            }
                        } else if (latestFile == null) {
                            // Nếu không có file nào khớp với userId, dùng file khác
                            latestFile = file;
                        }
                    }
                }
                
                if (latestFile != null) {
                    LOGGER.info("Using latest avatar file: " + latestFile.getName());
                    // Đọc file
                    Path path = latestFile.toPath();
                    byte[] fileContent = Files.readAllBytes(path);
                    
                    // Xác định content type từ tên file
                    String contentType = "image/jpeg"; // Mặc định
                    String fileName = latestFile.getName().toLowerCase();
                    if (fileName.endsWith(".png")) {
                        contentType = "image/png";
                    } else if (fileName.endsWith(".gif")) {
                        contentType = "image/gif";
                    } else if (fileName.endsWith(".webp")) {
                        contentType = "image/webp";
                    }
                    
                    return ResponseEntity.ok()
                            .header("Content-Type", contentType)
                            .body(fileContent);
                }
            }
            
            // Nếu không tìm thấy file avatar
            LOGGER.warning("No avatar file found for user: " + userId);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error retrieving avatar", e);
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    /**
     * Get banner image
     */
    @GetMapping("/{userId}/banner")
    public ResponseEntity<?> getBanner(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Error: User not found."));
            
            // Nếu người dùng không có banner, trả về 404
            if (user.getBannerImageUrl() == null) {
                return ResponseEntity.notFound().build();
            }
            
            LOGGER.info("Looking for banner for user ID: " + userId);
            LOGGER.info("Banner image URL: " + user.getBannerImageUrl());
            
            // Tìm file banner mới nhất cho người dùng này
            File directory = new File(bannerDir);
            File[] files = directory.listFiles();
            
            if (files != null && files.length > 0) {
                // Tìm file mới nhất
                File latestFile = null;
                for (File file : files) {
                    if (file.isFile()) {
                        LOGGER.info("Found file: " + file.getName());
                        // Ưu tiên file có prefix là userId
                        if (file.getName().startsWith(userId + "_")) {
                            if (latestFile == null || file.lastModified() > latestFile.lastModified()) {
                                latestFile = file;
                            }
                        } else if (latestFile == null) {
                            // Nếu không có file nào khớp với userId, dùng file khác
                            latestFile = file;
                        }
                    }
                }
                
                if (latestFile != null) {
                    LOGGER.info("Using latest banner file: " + latestFile.getName());
                    // Đọc file
                    Path path = latestFile.toPath();
                    byte[] fileContent = Files.readAllBytes(path);
                    
                    // Xác định content type từ tên file
                    String contentType = "image/jpeg"; // Mặc định
                    String fileName = latestFile.getName().toLowerCase();
                    if (fileName.endsWith(".png")) {
                        contentType = "image/png";
                    } else if (fileName.endsWith(".gif")) {
                        contentType = "image/gif";
                    } else if (fileName.endsWith(".webp")) {
                        contentType = "image/webp";
                    }
                    
                    return ResponseEntity.ok()
                            .header("Content-Type", contentType)
                            .body(fileContent);
                }
            }
            
            // Nếu không tìm thấy file banner
            LOGGER.warning("No banner file found for user: " + userId);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error retrieving banner", e);
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
} 