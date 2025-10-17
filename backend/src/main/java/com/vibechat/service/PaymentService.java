package com.vibechat.service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.vibechat.model.Subscription;

@Service
public class PaymentService {

    @Value("${vibechat.btc.wallet:1M9mactBVv4ygScFxzHbEsXHcvvH8WrvPG}")
    private String btcWalletAddress;

    /**
     * Process payment for subscription
     */
    public Map<String, Object> processPayment(Subscription.Tier tier, Subscription.PaymentMethod paymentMethod, String paymentDetails) {
        Map<String, Object> response = new HashMap<>();

        try {
            Double amount = PaymentService.getTierPrice(tier);

            switch (paymentMethod) {
                case BTC:
                    return processBTCPayment(tier, amount, paymentDetails);
                case CREDIT_CARD:
                case DEBIT_CARD:
                    return processCardPayment(tier, amount, paymentMethod, paymentDetails);
                case PAYPAL:
                    return processPayPalPayment(tier, amount, paymentDetails);
                default:
                    response.put("success", false);
                    response.put("error", "Unsupported payment method");
                    return response;
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Payment processing failed: " + e.getMessage());
            return response;
        }
    }

    /**
     * Process BTC payment
     */
    private Map<String, Object> processBTCPayment(Subscription.Tier tier, Double amount, String btcTransactionId) {
        Map<String, Object> response = new HashMap<>();

        // In a real implementation, you would verify the BTC transaction
        // For now, we'll simulate successful payment

        response.put("success", true);
        response.put("paymentMethod", "BTC");
        response.put("btcWallet", btcWalletAddress);
        response.put("amount", amount);
        response.put("transactionId", btcTransactionId);
        response.put("message", "BTC payment processed successfully. All funds deposited to: " + btcWalletAddress);

        return response;
    }

    /**
     * Process credit/debit card payment
     */
    private Map<String, Object> processCardPayment(Subscription.Tier tier, Double amount, Subscription.PaymentMethod paymentMethod, String paymentDetails) {
        Map<String, Object> response = new HashMap<>();

        // In a real implementation, you would integrate with a payment processor like Stripe
        // For now, we'll simulate successful payment

        String paymentReference = "CARD_" + UUID.randomUUID().toString().substring(0, 8);

        response.put("success", true);
        response.put("paymentMethod", paymentMethod.name());
        response.put("btcWallet", btcWalletAddress);
        response.put("amount", amount);
        response.put("paymentReference", paymentReference);
        response.put("message", paymentMethod.name() + " payment processed successfully. Funds converted to BTC and deposited to: " + btcWalletAddress);

        return response;
    }

    /**
     * Process PayPal payment
     */
    private Map<String, Object> processPayPalPayment(Subscription.Tier tier, Double amount, String paymentDetails) {
        Map<String, Object> response = new HashMap<>();

        // In a real implementation, you would integrate with PayPal API
        // For now, we'll simulate successful payment

        String paymentReference = "PAYPAL_" + UUID.randomUUID().toString().substring(0, 8);

        response.put("success", true);
        response.put("paymentMethod", "PAYPAL");
        response.put("btcWallet", btcWalletAddress);
        response.put("amount", amount);
        response.put("paymentReference", paymentReference);
        response.put("message", "PayPal payment processed successfully. Funds converted to BTC and deposited to: " + btcWalletAddress);

        return response;
    }

    /**
     * Get tier price
     */
    public static Double getTierPrice(Subscription.Tier tier) {
        Map<Subscription.Tier, Double> prices = new HashMap<>();
        prices.put(Subscription.Tier.FREE, 0.0);
        prices.put(Subscription.Tier.BOOST_PLUS_TIER_2, 8.99);
        prices.put(Subscription.Tier.BOOST_PLUS_TIER_3, 12.99);
        prices.put(Subscription.Tier.BOOST_PLUS_TIER_4, 25.99);
        prices.put(Subscription.Tier.BOOST_PLUS_TIER_5, 30.99);

        return prices.getOrDefault(tier, 0.0);
    }

    /**
     * Get available payment methods
     */
    public Map<String, Object> getPaymentMethods() {
        Map<String, Object> methods = new HashMap<>();

        methods.put("BTC", Map.of(
            "name", "Bitcoin",
            "description", "Direct BTC payment to wallet: " + btcWalletAddress,
            "wallet", btcWalletAddress
        ));

        methods.put("CREDIT_CARD", Map.of(
            "name", "Credit Card",
            "description", "Visa, MasterCard, American Express",
            "note", "Funds converted to BTC and deposited to: " + btcWalletAddress
        ));

        methods.put("DEBIT_CARD", Map.of(
            "name", "Debit Card",
            "description", "Visa Debit, MasterCard Debit",
            "note", "Funds converted to BTC and deposited to: " + btcWalletAddress
        ));

        methods.put("PAYPAL", Map.of(
            "name", "PayPal",
            "description", "Pay with your PayPal account",
            "note", "Funds converted to BTC and deposited to: " + btcWalletAddress
        ));

        return methods;
    }

    /**
     * Get BTC wallet address (read-only)
     */
    public String getBTCWalletAddress() {
        return btcWalletAddress;
    }
}
