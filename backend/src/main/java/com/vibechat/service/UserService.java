package com.vibechat.service;

import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vibechat.model.User;
import com.vibechat.model.dto.UserDTO;
import com.vibechat.model.repository.UserRepository;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private EmailVerificationService emailVerificationService;

    @Autowired
    private PreMadeServerService preMadeServerService;

    @Autowired
    private JwtService jwtService;

    public UserDTO.UserInfo createUser(UserDTO.RegisterRequest request) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Generate unique user ID and API token
        String userId = generateUniqueUserId();
        String apiToken = generateApiToken();
        String verificationToken = emailService.generateVerificationToken();

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setUserId(userId);
        user.setApiToken(apiToken);
        user.setIsActive(true);
        user.setIsSuperuser(false);
        user.setDeveloperMode(false);
        user.setEmailVerified(false);
        user.setVerificationToken(verificationToken);

        User savedUser = userRepository.save(user);

        // Send verification email
        try {
            emailService.sendVerificationEmail(
                request.getEmail(),
                request.getUsername(),
                verificationToken
            );
        } catch (Exception e) {
            // Log the error but don't fail registration
            System.err.println("Failed to send verification email: " + e.getMessage());
        }

        return mapToUserInfo(savedUser);
    }

    public Optional<UserDTO.AuthResponse> authenticateUser(UserDTO.LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());

        if (userOpt.isEmpty()) {
            return Optional.empty();
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return Optional.empty();
        }

        if (!user.getIsActive()) {
            throw new RuntimeException("User account is disabled");
        }

        // Generate JWT token
        String token = generateJwtToken(user);

        UserDTO.UserInfo userInfo = mapToUserInfo(user);

        UserDTO.AuthResponse authResponse = new UserDTO.AuthResponse(token, 864000000L, userInfo);

        return Optional.of(authResponse);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByUserId(String userId) {
        return userRepository.findByUserId(userId);
    }

    public Optional<User> findByApiToken(String apiToken) {
        return userRepository.findByApiToken(apiToken);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public UserDTO.UserInfo getUserInfo(User user) {
        return mapToUserInfo(user);
    }

    public UserDTO.UserInfo updateUserProfile(Long userId, UserDTO.RegisterRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updatedUser = userRepository.save(user);
        return mapToUserInfo(updatedUser);
    }

    public boolean verifyUserEmail(String verificationToken) {
        Optional<User> userOpt = userRepository.findByVerificationToken(verificationToken);

        if (userOpt.isEmpty()) {
            return false;
        }

        User user = userOpt.get();
        user.setEmailVerified(true);
        user.setVerificationToken(null); // Clear the token after verification
        userRepository.save(user);

        // Auto-assign user to a pre-made server after email verification
        try {
            preMadeServerService.assignUserToServer(user);
        } catch (Exception e) {
            System.err.println("Failed to assign user to pre-made server: " + e.getMessage());
        }

        return true;
    }

    public boolean checkEmailVerification(String userEmail, String verificationToken) {
        return emailVerificationService.checkVerificationEmail(userEmail, verificationToken);
    }

    private String generateUniqueUserId() {
        String userId;
        do {
            userId = generateUserId();
        } while (userRepository.existsByUserId(userId));
        return userId;
    }

    private String generateUserId() {
        Random random = new Random();
        StringBuilder userId = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            userId.append(random.nextInt(10));
        }
        return userId.toString();
    }

    private String generateApiToken() {
        Random random = new Random();
        StringBuilder token = new StringBuilder();
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (int i = 0; i < 32; i++) {
            token.append(chars.charAt(random.nextInt(chars.length())));
        }
        return token.toString();
    }

    public String generateJwtToken(User user) {
        return jwtService.generateToken(user);
    }

    private UserDTO.UserInfo mapToUserInfo(User user) {
        return new UserDTO.UserInfo(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getUserId(),
                user.getDeveloperMode(),
                user.getEmailVerified(),
                user.getCreatedAt() != null ? user.getCreatedAt().toString() : null
        );
    }

    public UserRepository getUserRepository() {
        return userRepository;
    }
}
