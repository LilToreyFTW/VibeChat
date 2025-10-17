package com.vibechat.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vibechat.model.Subscription;
import com.vibechat.model.User;
import com.vibechat.model.repository.SubscriptionRepository;

@Service
@Transactional
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private PaymentService paymentService;

    @Value("${vibechat.btc.wallet:1M9mactBVv4ygScFxzHbEsXHcvvH8WrvPG}")
    private String btcWalletAddress;

    // Tier pricing and features
    private final Map<Subscription.Tier, Double> TIER_PRICES = new HashMap<>();
    private final Map<Subscription.Tier, String> TIER_FEATURES = new HashMap<>();

    public SubscriptionService() {
        // Initialize tier pricing - Monthly/One-time payments
        TIER_PRICES.put(Subscription.Tier.FREE, 0.0);
        TIER_PRICES.put(Subscription.Tier.BOOST_PLUS_TIER_2, 8.99);  // Monthly
        TIER_PRICES.put(Subscription.Tier.BOOST_PLUS_TIER_3, 12.99); // Monthly
        TIER_PRICES.put(Subscription.Tier.BOOST_PLUS_TIER_4, 25.99); // Monthly
        TIER_PRICES.put(Subscription.Tier.BOOST_PLUS_TIER_5, 30.99); // Monthly

        // Initialize tier features
        TIER_FEATURES.put(Subscription.Tier.FREE, "Basic chat features");
        TIER_FEATURES.put(Subscription.Tier.BOOST_PLUS_TIER_2, "Stream screen at 1920x1080p 60FPS - Monthly $8.99 / One-time $15.99");
        TIER_FEATURES.put(Subscription.Tier.BOOST_PLUS_TIER_3, "Stream screen at 2160x1080 60FPS - Monthly $12.99 / One-time $25.99");
        TIER_FEATURES.put(Subscription.Tier.BOOST_PLUS_TIER_4, "Stream screen at 2160x1080 60FPS/4K - Monthly $25.99 / One-time $100.99");
        TIER_FEATURES.put(Subscription.Tier.BOOST_PLUS_TIER_5, "Stream screen at 3860x1440p 60fps with NVIDIA GeForce RTX 30/40/50 series GPU auto detection - Monthly $30.99 / One-time $350.99");
    }

    /**
     * Get all available subscription tiers
     */
    public Map<Subscription.Tier, Map<String, Object>> getAvailableTiers() {
        Map<Subscription.Tier, Map<String, Object>> tiers = new HashMap<>();

        for (Subscription.Tier tier : Subscription.Tier.values()) {
            Map<String, Object> tierInfo = new HashMap<>();
            tierInfo.put("price", TIER_PRICES.get(tier));
            tierInfo.put("features", TIER_FEATURES.get(tier));
            tierInfo.put("name", getTierDisplayName(tier));
            tiers.put(tier, tierInfo);
        }

        return tiers;
    }

    /**
     * Create a new subscription for a user
     */
    public Subscription createSubscription(User user, Subscription.Tier tier) {
        // Cancel any existing active subscription of the same tier
        cancelExistingSubscription(user, tier);

        Double price = TIER_PRICES.get(tier);
        String features = TIER_FEATURES.get(tier);

        Subscription subscription = new Subscription(user, tier, price, features);
        return subscriptionRepository.save(subscription);
    }

    /**
     * Get user's active subscriptions
     */
    public List<Subscription> getUserActiveSubscriptions(User user) {
        return subscriptionRepository.findActiveSubscriptionsByUser(user, LocalDateTime.now());
    }

    /**
     * Get user's subscription by tier
     */
    public Optional<Subscription> getUserSubscriptionByTier(User user, Subscription.Tier tier) {
        return subscriptionRepository.findByUserAndTierAndStatus(user, tier, Subscription.Status.ACTIVE);
    }

    /**
     * Cancel a subscription
     */
    public boolean cancelSubscription(Long subscriptionId) {
        Optional<Subscription> subscriptionOpt = subscriptionRepository.findById(subscriptionId);

        if (subscriptionOpt.isPresent()) {
            Subscription subscription = subscriptionOpt.get();
            subscription.setStatus(Subscription.Status.CANCELLED);
            subscriptionRepository.save(subscription);
            return true;
        }

        return false;
    }

    /**
     * Process payment for subscription using PaymentService
     */
    public Map<String, Object> processPayment(Subscription.Tier tier, Subscription.PaymentMethod paymentMethod, String paymentDetails) {
        return paymentService.processPayment(tier, paymentMethod, paymentDetails);
    }

    /**
     * Get subscription statistics
     */
    public Map<String, Object> getSubscriptionStats() {
        Map<String, Object> stats = new HashMap<>();

        LocalDateTime now = LocalDateTime.now();

        for (Subscription.Tier tier : Subscription.Tier.values()) {
            Long count = subscriptionRepository.countActiveSubscriptionsByTier(tier, now);
            stats.put(tier.name(), count);
        }

        stats.put("totalActiveSubscriptions", subscriptionRepository.findAllActiveSubscriptions(now).size());
        stats.put("btcWalletAddress", btcWalletAddress);

        return stats;
    }

    /**
     * Check if user has active subscription for tier
     */
    public boolean hasActiveSubscription(User user, Subscription.Tier tier) {
        return subscriptionRepository.findByUserAndTierAndStatus(user, tier, Subscription.Status.ACTIVE).isPresent();
    }

    /**
     * Get user's current highest tier
     */
    public Optional<Subscription.Tier> getUserHighestTier(User user) {
        List<Subscription> activeSubscriptions = subscriptionRepository.findActiveSubscriptionsByUser(user, LocalDateTime.now());

        if (activeSubscriptions.isEmpty()) {
            return Optional.of(Subscription.Tier.FREE);
        }

        // Return the highest tier the user has
        return activeSubscriptions.stream()
                .map(Subscription::getTier)
                .max((a, b) -> {
                    int[] tierOrder = {0, 1, 2, 3, 4}; // FREE, TIER_2, TIER_3, TIER_4, TIER_5
                    return Integer.compare(
                        java.util.Arrays.asList(Subscription.Tier.values()).indexOf(a),
                        java.util.Arrays.asList(Subscription.Tier.values()).indexOf(b)
                    );
                });
    }

    private void cancelExistingSubscription(User user, Subscription.Tier tier) {
        Optional<Subscription> existingSubscription = subscriptionRepository.findByUserAndTierAndStatus(user, tier, Subscription.Status.ACTIVE);

        if (existingSubscription.isPresent()) {
            Subscription subscription = existingSubscription.get();
            subscription.setStatus(Subscription.Status.CANCELLED);
            subscriptionRepository.save(subscription);
        }
    }

    private String getTierDisplayName(Subscription.Tier tier) {
        switch (tier) {
            case FREE:
                return "Free";
            case BOOST_PLUS_TIER_2:
                return "BOOST+ Tier 2";
            case BOOST_PLUS_TIER_3:
                return "BOOST+ Tier 3";
            case BOOST_PLUS_TIER_4:
                return "BOOST+ Tier 4";
            case BOOST_PLUS_TIER_5:
                return "BOOST+ Tier 5 (RTX)";
            default:
                return tier.name();
        }
    }
}
