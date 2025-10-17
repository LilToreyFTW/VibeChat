package com.vibechat.service;

import com.vibechat.model.dto.AIRequestDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class AIService {

    @Value("${vibechat.room.base-url}")
    private String baseRoomUrl;

    @Value("${vibechat.room.code-length}")
    private int roomCodeLength;

    public AIRequestDTO.LinkGenerationResponse generateRoomLink(AIRequestDTO.LinkGenerationRequest request) {
        // Generate random room code
        String roomCode = generateRandomString(request.getLength() != null ? request.getLength() : roomCodeLength);

        // Create full room URL
        String roomUrl = baseRoomUrl + "/" + roomCode;

        return new AIRequestDTO.LinkGenerationResponse(roomUrl, roomCode);
    }

    public Map<String, String> generateUserId() {
        String userId = generateRandomString(10);

        Map<String, String> response = new HashMap<>();
        response.put("user_id", userId);
        response.put("message", "Unique user ID generated successfully");

        return response;
    }

    public Map<String, String> generateApiToken() {
        String apiToken = generateRandomString(32);

        Map<String, String> response = new HashMap<>();
        response.put("api_token", apiToken);
        response.put("message", "API token generated successfully");

        return response;
    }

    public AIRequestDTO.AIAnalysisResponse analyzeText(AIRequestDTO.AIAnalysisRequest request) {
        // Placeholder for AI analysis
        // In a real implementation, you would use OpenAI, Anthropic, or another AI service

        Map<String, Object> result = new HashMap<>();
        result.put("analysis_type", request.getAnalysisType());
        result.put("text_length", request.getText().length());
        result.put("word_count", request.getText().split("\\s+").length);

        // Placeholder confidence score
        double confidence = 0.85;

        return new AIRequestDTO.AIAnalysisResponse(result, confidence);
    }

    private String generateRandomString(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new Random();
        StringBuilder result = new StringBuilder();

        for (int i = 0; i < length; i++) {
            result.append(chars.charAt(random.nextInt(chars.length())));
        }

        return result.toString();
    }
}
