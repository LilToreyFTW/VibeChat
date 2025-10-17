package com.vibechat.model.dto;

import java.util.Map;

import jakarta.validation.constraints.NotBlank;

public class AIRequestDTO {

    public static class LinkGenerationRequest {
        private Integer length = 8;

        // Constructors
        public LinkGenerationRequest() {}

        public LinkGenerationRequest(Integer length) {
            this.length = length;
        }

        // Getters and Setters
        public Integer getLength() {
            return length;
        }

        public void setLength(Integer length) {
            this.length = length;
        }
    }

    public static class LinkGenerationResponse {
        private String roomUrl;
        private String roomCode;

        // Constructors
        public LinkGenerationResponse() {}

        public LinkGenerationResponse(String roomUrl, String roomCode) {
            this.roomUrl = roomUrl;
            this.roomCode = roomCode;
        }

        // Getters and Setters
        public String getRoomUrl() {
            return roomUrl;
        }

        public void setRoomUrl(String roomUrl) {
            this.roomUrl = roomUrl;
        }

        public String getRoomCode() {
            return roomCode;
        }

        public void setRoomCode(String roomCode) {
            this.roomCode = roomCode;
        }
    }

    public static class AIAnalysisRequest {
        @NotBlank
        private String text;

        private String analysisType = "sentiment"; // sentiment, toxicity, relevance

        // Constructors
        public AIAnalysisRequest() {}

        public AIAnalysisRequest(String text, String analysisType) {
            this.text = text;
            this.analysisType = analysisType;
        }

        // Getters and Setters
        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }

        public String getAnalysisType() {
            return analysisType;
        }

        public void setAnalysisType(String analysisType) {
            this.analysisType = analysisType;
        }
    }

    public static class AIAnalysisResponse {
        private Map<String, Object> result;
        private Double confidence;

        // Constructors
        public AIAnalysisResponse() {}

        public AIAnalysisResponse(Map<String, Object> result, Double confidence) {
            this.result = result;
            this.confidence = confidence;
        }

        // Getters and Setters
        public Map<String, Object> getResult() {
            return result;
        }

        public void setResult(Map<String, Object> result) {
            this.result = result;
        }

        public Double getConfidence() {
            return confidence;
        }

        public void setConfidence(Double confidence) {
            this.confidence = confidence;
        }
    }
}
