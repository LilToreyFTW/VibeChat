package com.vibechat.model.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.vibechat.model.PreMadeServer;

@Repository
public interface PreMadeServerRepository extends JpaRepository<PreMadeServer, Long> {

    Optional<PreMadeServer> findByServerName(String serverName);

    List<PreMadeServer> findByIsActiveTrue();

    List<PreMadeServer> findByAutoAssignUsersTrueAndIsActiveTrue();

    @Query("SELECT s FROM PreMadeServer s WHERE s.isActive = true ORDER BY s.currentMembers ASC LIMIT 1")
    Optional<PreMadeServer> findLeastPopulatedActiveServer();
}
