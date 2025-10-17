package com.vibechat.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vibechat.model.Subscription;
import com.vibechat.model.User;
import com.vibechat.model.dto.SubscriptionDTO;
import com.vibechat.service.PaymentService;
import com.vibechat.service.SubscriptionService;
import com.vibechat.service.UserService;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private UserService userService;

    @Autowired
    private PaymentService paymentService;

    @GetMapping("/tiers")
    public ResponseEntity<Map<Subscription.Tier, Map<String, Object>>> getAvailableTiers() {
        Map<Subscription.Tier, Map<String, Object>> tiers = subscriptionService.getAvailableTiers();
        return ResponseEntity.ok(tiers);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Subscription>> getMySubscriptions(@RequestHeader("X-User-Username") String username) {
        Optional<User> userOpt = userService.findByUsername(username);

        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<Subscription> subscriptions = subscriptionService.getUserActiveSubscriptions(userOpt.get());
        return ResponseEntity.ok(subscriptions);
    }

    @PostMapping("/purchase")
    public ResponseEntity<?> purchaseSubscription(
            @RequestBody SubscriptionDTO.CreateSubscriptionRequest request,
            @RequestHeader("X-User-Username") String username) {

        Optional<User> userOpt = userService.findByUsername(username);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
        }

        try {
            Subscription subscription = subscriptionService.createSubscription(userOpt.get(), request.getTier());

            // Process payment using PaymentService
            Map<String, Object> paymentResult = subscriptionService.processPayment(
                request.getTier(),
                request.getPaymentMethod(),
                request.getPaymentDetails()
            );

            if ((Boolean) paymentResult.get("success")) {
                // Update subscription with payment details
                subscription.setPaymentMethod(request.getPaymentMethod());
                subscription.setPaymentReference((String) paymentResult.get("paymentReference"));

                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Subscription created successfully",
                    "subscription", subscription,
                    "paymentInfo", paymentResult
                ));
            } else {
                // Payment failed, cancel subscription
                subscriptionService.cancelSubscription(subscription.getId());
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Payment failed",
                    "error", paymentResult.get("error")
                ));
            }

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to create subscription: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/cancel/{subscriptionId}")
    public ResponseEntity<?> cancelSubscription(
            @PathVariable Long subscriptionId,
            @RequestHeader("X-User-Username") String username) {

        Optional<User> userOpt = userService.findByUsername(username);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
        }

        boolean cancelled = subscriptionService.cancelSubscription(subscriptionId);

        if (cancelled) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Subscription cancelled successfully"
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Failed to cancel subscription"
            ));
        }
    }

    @GetMapping("/payment-methods")
    public ResponseEntity<Map<String, Object>> getPaymentMethods() {
        Map<String, Object> methods = paymentService.getPaymentMethods();
        return ResponseEntity.ok(methods);
    }

    @GetMapping("/btc-wallet")
    public ResponseEntity<Map<String, String>> getBTCWallet() {
        return ResponseEntity.ok(Map.of("btcWallet", paymentService.getBTCWalletAddress()));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSubscriptionStats() {
        Map<String, Object> stats = subscriptionService.getSubscriptionStats();
        return ResponseEntity.ok(stats);
    }
}
