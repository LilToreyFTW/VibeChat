package com.vibechat.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "bots")
public class Bot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 1, max = 100)
    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(unique = true, nullable = false, length = 255)
    private String botToken;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(nullable = false, length = 50)
    private String aiModel = "gpt-3.5-turbo";

    @Column(length = 1000)
    private String personality;

    // Bot capability restrictions (hardcoded rules enforcement)
    @Column(nullable = false)
    private Boolean canMonitorRoom = true;

    @Column(nullable = false)
    private Boolean canCreateRoles = true;

    @Column(nullable = false)
    private Boolean canCreateModerators = true;

    // Prohibited capabilities (always false - hardcoded restrictions)
    @Column(nullable = false)
    private Boolean canSearchUsers = false;

    @Column(nullable = false)
    private Boolean canFetchUserData = false;

    @Column(nullable = false)
    private Boolean canDDoS = false;

    @Column(nullable = false)
    private Boolean canReverseConnect = false;

    @Column(nullable = false)
    private Boolean canAccessUserSystems = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    // Constructors
    public Bot() {}

    public Bot(String name, String description, User owner) {
        this.name = name;
        this.description = description;
        this.owner = owner;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBotToken() {
        return botToken;
    }

    public void setBotToken(String botToken) {
        this.botToken = botToken;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getAiModel() {
        return aiModel;
    }

    public void setAiModel(String aiModel) {
        this.aiModel = aiModel;
    }

    public String getPersonality() {
        return personality;
    }

    public void setPersonality(String personality) {
        this.personality = personality;
    }

    // Bot capability getters and setters (hardcoded rules)
    public Boolean getCanMonitorRoom() {
        return canMonitorRoom;
    }

    public void setCanMonitorRoom(Boolean canMonitorRoom) {
        this.canMonitorRoom = canMonitorRoom != null ? canMonitorRoom : true;
    }

    public Boolean getCanCreateRoles() {
        return canCreateRoles;
    }

    public void setCanCreateRoles(Boolean canCreateRoles) {
        this.canCreateRoles = canCreateRoles != null ? canCreateRoles : true;
    }

    public Boolean getCanCreateModerators() {
        return canCreateModerators;
    }

    public void setCanCreateModerators(Boolean canCreateModerators) {
        this.canCreateModerators = canCreateModerators != null ? canCreateModerators : true;
    }

    // Prohibited capabilities (always return false - hardcoded restrictions)
    public Boolean getCanSearchUsers() {
        return false; // Always false - hardcoded restriction
    }

    public Boolean getCanFetchUserData() {
        return false; // Always false - hardcoded restriction
    }

    public Boolean getCanDDoS() {
        return false; // Always false - hardcoded restriction
    }

    public Boolean getCanReverseConnect() {
        return false; // Always false - hardcoded restriction
    }

    public Boolean getCanAccessUserSystems() {
        return false; // Always false - hardcoded restriction
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

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    @Override
    public String toString() {
        return "Bot{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", botToken='" + botToken + '\'' +
                ", isActive=" + isActive +
                ", aiModel='" + aiModel + '\'' +
                '}';
    }
}
