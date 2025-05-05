package com.youtube.clone.backend.controllers;

import com.youtube.clone.backend.model.History;
import com.youtube.clone.backend.payload.request.AddToHistoryRequest;
import com.youtube.clone.backend.security.services.UserDetailsImpl;
import com.youtube.clone.backend.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/history")
public class HistoryController {

    @Autowired
    private HistoryService historyService;

    /**
     * Lấy lịch sử xem của người dùng
     */
    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<History>> getUserHistory(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<History> history = historyService.getUserHistory(userDetails.getId());
        return ResponseEntity.ok(history);
    }

    /**
     * Thêm video vào lịch sử xem
     */
    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<History> addToHistory(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody AddToHistoryRequest request) {
        History history = historyService.addToHistory(userDetails.getId(), request);
        return ResponseEntity.ok(history);
    }

    /**
     * Xóa một video khỏi lịch sử xem
     */
    @DeleteMapping("/{videoId}")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> removeFromHistory(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable String videoId) {
        historyService.removeFromHistory(userDetails.getId(), videoId);
        return ResponseEntity.ok().build();
    }

    /**
     * Xóa toàn bộ lịch sử xem
     */
    @DeleteMapping
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> clearHistory(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        historyService.clearHistory(userDetails.getId());
        return ResponseEntity.ok().build();
    }
}