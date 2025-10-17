package com.vibechat.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailVerificationService {

    @Value("${vibechat.email.verification.enabled:false}")
    private boolean verificationEnabled;

    /**
     * Check if email verification is enabled and validate the token
     * For development, this always returns true if verification is disabled
     */
    public boolean checkVerificationEmail(String userEmail, String verificationToken) {
        if (!verificationEnabled) {
            // In development mode, always return true for email verification
            return true;
        }

        // In production, you would implement proper email checking here
        // For now, we'll just validate that the token is not empty/null
        return verificationToken != null && !verificationToken.trim().isEmpty();
    }

    /**
     * Simple token validation - in production this would check against a database
     */
    public boolean validateVerificationToken(String token) {
        if (!verificationEnabled) {
            return true;
        }

        // Basic validation - token should not be empty and be a valid UUID format
        if (token == null || token.trim().isEmpty()) {
            return false;
        }

        try {
            // Try to parse as UUID for basic validation
            java.util.UUID.fromString(token);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
}
