package com.vibechat.model.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.vibechat.model.Subscription;
import com.vibechat.model.User;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    List<Subscription> findByUser(User user);

    List<Subscription> findByUserAndStatus(User user, Subscription.Status status);

    Optional<Subscription> findByUserAndTierAndStatus(User user, Subscription.Tier tier, Subscription.Status status);

    List<Subscription> findByStatus(Subscription.Status status);

    @Query("SELECT s FROM Subscription s WHERE s.user = :user AND s.status = 'ACTIVE' AND (s.endDate IS NULL OR s.endDate > :now) ORDER BY s.endDate DESC")
    List<Subscription> findActiveSubscriptionsByUser(@Param("user") User user, @Param("now") LocalDateTime now);

    @Query("SELECT s FROM Subscription s WHERE s.status = 'ACTIVE' AND (s.endDate IS NULL OR s.endDate > :now)")
    List<Subscription> findAllActiveSubscriptions(@Param("now") LocalDateTime now);

    @Query("SELECT COUNT(s) FROM Subscription s WHERE s.tier = :tier AND s.status = 'ACTIVE' AND (s.endDate IS NULL OR s.endDate > :now)")
    Long countActiveSubscriptionsByTier(@Param("tier") Subscription.Tier tier, @Param("now") LocalDateTime now);
}
