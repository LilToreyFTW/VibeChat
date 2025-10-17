package com.vibechat.model.dto;

import com.vibechat.model.Subscription;

public class SubscriptionDTO {

    public static class CreateSubscriptionRequest {
        private Subscription.Tier tier;
        private Subscription.PaymentMethod paymentMethod = Subscription.PaymentMethod.BTC;
        private String paymentDetails;

        // Getters and Setters
        public Subscription.Tier getTier() {
            return tier;
        }

        public void setTier(Subscription.Tier tier) {
            this.tier = tier;
        }

        public Subscription.PaymentMethod getPaymentMethod() {
            return paymentMethod;
        }

        public void setPaymentMethod(Subscription.PaymentMethod paymentMethod) {
            this.paymentMethod = paymentMethod;
        }

        public String getPaymentDetails() {
            return paymentDetails;
        }

        public void setPaymentDetails(String paymentDetails) {
            this.paymentDetails = paymentDetails;
        }
    }

    public static class SubscriptionResponse {
        private Long id;
        private String tier;
        private String status;
        private Double price;
        private String currency;
        private String startDate;
        private String endDate;
        private String features;
        private String btcWalletAddress;

        public SubscriptionResponse(Subscription subscription, String btcWalletAddress) {
            this.id = subscription.getId();
            this.tier = subscription.getTier().name();
            this.status = subscription.getStatus().name();
            this.price = subscription.getPrice();
            this.currency = subscription.getCurrency();
            this.startDate = subscription.getStartDate().toString();
            this.endDate = subscription.getEndDate() != null ? subscription.getEndDate().toString() : null;
            this.features = subscription.getFeatures();
            this.btcWalletAddress = btcWalletAddress;
        }

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getTier() { return tier; }
        public void setTier(String tier) { this.tier = tier; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }

        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }

        public String getStartDate() { return startDate; }
        public void setStartDate(String startDate) { this.startDate = startDate; }

        public String getEndDate() { return endDate; }
        public void setEndDate(String endDate) { this.endDate = endDate; }

        public String getFeatures() { return features; }
        public void setFeatures(String features) { this.features = features; }

        public String getBtcWalletAddress() { return btcWalletAddress; }
        public void setBtcWalletAddress(String btcWalletAddress) { this.btcWalletAddress = btcWalletAddress; }
    }

    public static class TierInfo {
        private String tier;
        private Double price;
        private String features;
        private String name;

        public TierInfo(Subscription.Tier tier, Double price, String features, String name) {
            this.tier = tier.name();
            this.price = price;
            this.features = features;
            this.name = name;
        }

        // Getters and Setters
        public String getTier() { return tier; }
        public void setTier(String tier) { this.tier = tier; }

        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }

        public String getFeatures() { return features; }
        public void setFeatures(String features) { this.features = features; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }
}
