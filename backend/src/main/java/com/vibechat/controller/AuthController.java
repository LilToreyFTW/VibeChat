package com.vibechat.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.vibechat.model.User;
import com.vibechat.model.dto.UserDTO;
import com.vibechat.model.repository.UserRepository;
import com.vibechat.service.EmailService;
import com.vibechat.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody UserDTO.RegisterRequest request) {
        try {
            UserDTO.UserInfo userInfo = userService.createUser(request);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User registered successfully");
            response.put("user", userInfo);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserDTO.LoginRequest request) {
        try {
            // Custom owner authentication - only allow specific credentials
            if ("AdminT".equals(request.getUsername()) &&
                "Torey991200@##@@##".equals(request.getPassword())) {

                // Create or get the admin user
                Optional<User> existingUser = userService.findByUsername("AdminT");
                User adminUser;

                if (existingUser.isPresent()) {
                    adminUser = existingUser.get();
                } else {
                    // Create the admin user
                    UserDTO.RegisterRequest registerRequest = new UserDTO.RegisterRequest();
                    registerRequest.setUsername("AdminT");
                    registerRequest.setEmail("admin@vibechat.com");
                    registerRequest.setPassword("Torey991200@##@@##");
                    registerRequest.setFullName("VibeChat Administrator");

                    UserDTO.UserInfo userInfo = userService.createUser(registerRequest);
                    adminUser = userService.findByUsername("AdminT").orElseThrow();
                }

                // Mark as verified and superuser
                adminUser.setEmailVerified(true);
                adminUser.setIsSuperuser(true);
                adminUser.setDeveloperMode(true);
                userService.getUserRepository().save(adminUser);

                // Generate JWT token
                String token = userService.generateJwtToken(adminUser);

                UserDTO.UserInfo userInfo = userService.getUserInfo(adminUser);
                UserDTO.AuthResponse authResponse = new UserDTO.AuthResponse(token, 864000000L, userInfo);

                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Owner login successful");
                response.put("data", authResponse);

                return ResponseEntity.ok(response);
            }

            // For any other login attempt, reject it
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Access denied. Only the owner can login.");

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Login failed: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            // Extract token from Bearer format
            String jwtToken = token.replace("Bearer ", "");

            // Here you would validate the JWT token
            // For now, we'll just return a success response

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Token is valid");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Invalid token");

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        try {
            boolean verified = userService.verifyUserEmail(token);

            if (verified) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Email verified successfully");

                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Invalid or expired verification token");

                return ResponseEntity.badRequest().body(error);
            }

        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/check-email-verification")
    public ResponseEntity<?> checkEmailVerification(
            @RequestParam String email,
            @RequestParam String token) {
        try {
            boolean verified = userService.checkEmailVerification(email, token);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("verified", verified);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestParam String email) {
        try {
            // Find user by email
            Optional<User> userOpt = userService.findByEmail(email);

            if (userOpt.isEmpty()) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "User not found");

                return ResponseEntity.notFound().build();
            }

            User user = userOpt.get();

            // Generate new verification token
            String newToken = UUID.randomUUID().toString();
            user.setVerificationToken(newToken);
            userRepository.save(user);

            // Send verification email
            emailService.sendVerificationEmail(user.getEmail(), user.getUsername(), newToken);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Verification email sent successfully");

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }
}
