package com.vibechat.controller;

import com.vibechat.model.dto.AIRequestDTO;
import com.vibechat.service.AIService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/generate-room-link")
    public ResponseEntity<?> generateRoomLink(@Valid @RequestBody AIRequestDTO.LinkGenerationRequest request) {
        try {
            AIRequestDTO.LinkGenerationResponse response = aiService.generateRoomLink(request);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Room link generated successfully");
            result.put("data", response);

            return ResponseEntity.ok(result);

        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/generate-user-id")
    public ResponseEntity<?> generateUserId() {
        try {
            Map<String, String> response = aiService.generateUserId();

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "User ID generated successfully");
            result.put("data", response);

            return ResponseEntity.ok(result);

        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/generate-api-token")
    public ResponseEntity<?> generateApiToken() {
        try {
            Map<String, String> response = aiService.generateApiToken();

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "API token generated successfully");
            result.put("data", response);

            return ResponseEntity.ok(result);

        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/analyze-text")
    public ResponseEntity<?> analyzeText(@Valid @RequestBody AIRequestDTO.AIAnalysisRequest request) {
        try {
            AIRequestDTO.AIAnalysisResponse response = aiService.analyzeText(request);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "Text analyzed successfully");
            result.put("data", response);

            return ResponseEntity.ok(result);

        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }
}
