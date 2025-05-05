package com.youtube.clone.backend.controllers;

import com.youtube.clone.backend.payload.response.MessageResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.logging.Level;
import java.util.logging.Logger;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger LOGGER = Logger.getLogger(GlobalExceptionHandler.class.getName());

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> globalExceptionHandler(Exception ex, WebRequest request) {
        LOGGER.log(Level.SEVERE, "Unhandled exception", ex);
        LOGGER.info("Request details: " + request.toString());

        // Prepare error message
        String errorMessage = "An error occurred: " + ex.getMessage();
        
        // Return error response
        return new ResponseEntity<>(new MessageResponse(errorMessage), HttpStatus.INTERNAL_SERVER_ERROR);
    }
} 