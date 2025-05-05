package com.youtube.clone.backend.service;

import com.youtube.clone.backend.config.FileStorageConfig;
import com.youtube.clone.backend.exception.FileStorageException;
import com.youtube.clone.backend.exception.FileNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path videoUploadPath;
    private final Path thumbnailUploadPath;
    private final long maxFileSize;
    private final String[] allowedFileTypes;

    @Autowired
    public FileStorageService(FileStorageConfig fileStorageConfig) {
        this.videoUploadPath = Paths.get(fileStorageConfig.getUploadDir())
                .toAbsolutePath().normalize();
        this.thumbnailUploadPath = Paths.get(fileStorageConfig.getThumbnailDir())
                .toAbsolutePath().normalize();
        this.maxFileSize = fileStorageConfig.getMaxFileSize();
        this.allowedFileTypes = fileStorageConfig.getAllowedFileTypes();

        try {
            Files.createDirectories(this.videoUploadPath);
            Files.createDirectories(this.thumbnailUploadPath);
        } catch (Exception ex) {
            throw new FileStorageException("Could not create the directory where the uploaded files will be stored.",
                    ex);
        }
    }

    public String storeVideo(MultipartFile file) {
        try {
            // Check if directory exists
            if (!Files.exists(this.videoUploadPath)) {
                try {
                    Files.createDirectories(this.videoUploadPath);
                    System.out.println("Created directory: " + this.videoUploadPath);
                } catch (Exception ex) {
                    throw new FileStorageException("Could not create video upload directory: " + this.videoUploadPath,
                            ex);
                }
            }

            // Validate file size
            if (file.getSize() > maxFileSize) {
                throw new FileStorageException("File size exceeds maximum limit of " + maxFileSize + " bytes");
            }

            // Validate file type
            String contentType = file.getContentType();
            System.out.println("Received file content type: " + contentType);

            if (contentType == null) {
                throw new FileStorageException("Content type is null");
            }

            boolean isAllowed = false;
            for (String allowedType : allowedFileTypes) {
                if (contentType.equals(allowedType)) {
                    isAllowed = true;
                    break;
                }
            }

            if (!isAllowed) {
                throw new FileStorageException("File type '" + contentType + "' not supported. Allowed types: "
                        + String.join(", ", allowedFileTypes));
            }

            // Create a unique filename
            String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
            System.out.println("Original filename: " + originalFileName);

            String fileExtension = "";
            if (originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String fileName = UUID.randomUUID().toString() + fileExtension;
            System.out.println("Generated filename: " + fileName);

            try {
                // Copy file to the target location
                Path targetLocation = this.videoUploadPath.resolve(fileName);
                System.out.println("Target location: " + targetLocation);
                Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
                System.out.println("File stored successfully at: " + targetLocation);

                return fileName;
            } catch (IOException ex) {
                throw new FileStorageException("Could not store file " + fileName + " at location "
                        + this.videoUploadPath + ". Please check directory permissions.", ex);
            }
        } catch (Exception ex) {
            // Catch any other exception that might occur
            throw new FileStorageException("Error storing video file: " + ex.getMessage(), ex);
        }
    }

    public String storeThumbnail(MultipartFile file) {
        // Create a unique filename
        String originalFileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = "";
        if (originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String fileName = UUID.randomUUID().toString() + fileExtension;

        try {
            // Copy file to the target location
            Path targetLocation = this.thumbnailUploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            throw new FileStorageException("Could not store thumbnail " + fileName + ". Please try again!", ex);
        }
    }

    public Resource loadVideoAsResource(String fileName) {
        try {
            System.out.println("Loading video resource: " + fileName);
            Path filePath = this.videoUploadPath.resolve(fileName).normalize();
            System.out.println("Full video path: " + filePath);
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                System.out.println("Video resource exists");
                return resource;
            } else {
                System.out.println("Video resource not found: " + fileName);
                throw new FileNotFoundException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            System.out.println("Malformed URL exception for video: " + fileName);
            throw new FileNotFoundException("File not found " + fileName, ex);
        }
    }

    public Resource loadThumbnailAsResource(String fileName) {
        try {
            Path filePath = this.thumbnailUploadPath.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new FileNotFoundException("Thumbnail not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new FileNotFoundException("Thumbnail not found " + fileName, ex);
        }
    }
}