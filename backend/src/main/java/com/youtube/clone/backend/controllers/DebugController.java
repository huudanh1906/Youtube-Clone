package com.youtube.clone.backend.controllers;

import com.youtube.clone.backend.security.jwt.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/debug")
public class DebugController {

    private static final Logger LOGGER = Logger.getLogger(DebugController.class.getName());

    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @Autowired
    private JwtUtils jwtUtils;

    @GetMapping("/user-columns")
    public List<Map<String, Object>> getUserTableColumns() {
        LOGGER.info("Getting user table structure");
        String sql = "SHOW COLUMNS FROM users";
        return jdbcTemplate.queryForList(sql);
    }
    
    @GetMapping("/token-info")
    public ResponseEntity<?> getTokenInfo(HttpServletRequest request) {
        LOGGER.info("Debugging token information");
        
        String authHeader = request.getHeader("Authorization");
        Map<String, Object> response = new HashMap<>();
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.put("error", "No Authorization header found or it does not start with 'Bearer '");
            return ResponseEntity.badRequest().body(response);
        }
        
        String jwt = authHeader.substring(7);
        response.put("token", jwt);
        
        try {
            // Validate token
            boolean isValid = jwtUtils.validateJwtToken(jwt);
            response.put("isValid", isValid);
            
            if (isValid) {
                // Extract information
                String username = jwtUtils.getUserNameFromJwtToken(jwt);
                Long userId = jwtUtils.getUserIdFromJwtToken(jwt);
                
                response.put("username", username);
                response.put("userId", userId);
            }
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error validating token", e);
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
} 