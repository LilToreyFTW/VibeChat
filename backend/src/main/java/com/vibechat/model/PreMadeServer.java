package com.vibechat.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "pre_made_servers")
public class PreMadeServer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true, nullable = false)
    private String serverName;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private String serverType; // "GAMING", "STUDY", "WORK", "SOCIAL", "GENERAL"

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(nullable = false)
    private Integer maxMembers = 1000;

    @Column(nullable = false)
    private String themeColor = "#8B5CF6";

    @Column(length = 500)
    private String serverIcon;

    @Column(nullable = false)
    private Boolean autoAssignUsers = true;

    @Column(nullable = false)
    private Integer currentMembers = 0;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // Constructors
    public PreMadeServer() {}

    public PreMadeServer(String serverName, String description, String serverType, String themeColor) {
        this.serverName = serverName;
        this.description = description;
        this.serverType = serverType;
        this.themeColor = themeColor;
        this.isActive = true;
        this.autoAssignUsers = true;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getServerName() {
        return serverName;
    }

    public void setServerName(String serverName) {
        this.serverName = serverName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getServerType() {
        return serverType;
    }

    public void setServerType(String serverType) {
        this.serverType = serverType;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Integer getMaxMembers() {
        return maxMembers;
    }

    public void setMaxMembers(Integer maxMembers) {
        this.maxMembers = maxMembers;
    }

    public String getThemeColor() {
        return themeColor;
    }

    public void setThemeColor(String themeColor) {
        this.themeColor = themeColor;
    }

    public String getServerIcon() {
        return serverIcon;
    }

    public void setServerIcon(String serverIcon) {
        this.serverIcon = serverIcon;
    }

    public Boolean getAutoAssignUsers() {
        return autoAssignUsers;
    }

    public void setAutoAssignUsers(Boolean autoAssignUsers) {
        this.autoAssignUsers = autoAssignUsers;
    }

    public Integer getCurrentMembers() {
        return currentMembers;
    }

    public void setCurrentMembers(Integer currentMembers) {
        this.currentMembers = currentMembers;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void incrementMembers() {
        this.currentMembers++;
    }

    public void decrementMembers() {
        if (this.currentMembers > 0) {
            this.currentMembers--;
        }
    }

    @Override
    public String toString() {
        return "PreMadeServer{" +
                "id=" + id +
                ", serverName='" + serverName + '\'' +
                ", serverType='" + serverType + '\'' +
                ", isActive=" + isActive +
                ", currentMembers=" + currentMembers +
                '}';
    }
}
