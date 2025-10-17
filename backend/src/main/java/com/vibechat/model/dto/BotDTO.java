package com.vibechat.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class BotDTO {

    public static class CreateBotRequest {
        @NotBlank
        @Size(min = 1, max = 100)
        private String name;

        @Size(max = 500)
        private String description;

        @Size(max = 50)
        private String aiModel = "gpt-3.5-turbo";

        @Size(max = 1000)
        private String personality;

        private Long roomId;

        // Constructors
        public CreateBotRequest() {}

        public CreateBotRequest(String name, String description) {
            this.name = name;
            this.description = description;
        }

        // Getters and Setters
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

        public Long getRoomId() {
            return roomId;
        }

        public void setRoomId(Long roomId) {
            this.roomId = roomId;
        }
    }

    public static class BotResponse {
        private Long id;
        private String name;
        private String description;
        private String botToken;
        private Boolean isActive;
        private String aiModel;
        private String personality;
        private String createdAt;
        private OwnerInfo owner;
        private RoomInfo room;

        // Bot capability fields (hardcoded rules)
        private Boolean canMonitorRoom;
        private Boolean canCreateRoles;
        private Boolean canCreateModerators;
        private Boolean canSearchUsers;
        private Boolean canFetchUserData;
        private Boolean canDDoS;
        private Boolean canReverseConnect;
        private Boolean canAccessUserSystems;

        // Constructors
        public BotResponse() {}

        public BotResponse(Long id, String name, String description, String botToken,
                          Boolean isActive, String aiModel, String personality,
                          String createdAt, OwnerInfo owner, RoomInfo room,
                          Boolean canMonitorRoom, Boolean canCreateRoles, Boolean canCreateModerators,
                          Boolean canSearchUsers, Boolean canFetchUserData, Boolean canDDoS,
                          Boolean canReverseConnect, Boolean canAccessUserSystems) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.botToken = botToken;
            this.isActive = isActive;
            this.aiModel = aiModel;
            this.personality = personality;
            this.createdAt = createdAt;
            this.owner = owner;
            this.room = room;
            this.canMonitorRoom = canMonitorRoom;
            this.canCreateRoles = canCreateRoles;
            this.canCreateModerators = canCreateModerators;
            this.canSearchUsers = canSearchUsers;
            this.canFetchUserData = canFetchUserData;
            this.canDDoS = canDDoS;
            this.canReverseConnect = canReverseConnect;
            this.canAccessUserSystems = canAccessUserSystems;
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

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public OwnerInfo getOwner() {
            return owner;
        }

        public void setOwner(OwnerInfo owner) {
            this.owner = owner;
        }

        public RoomInfo getRoom() {
            return room;
        }

        public void setRoom(RoomInfo room) {
            this.room = room;
        }

        // Bot capability getters and setters
        public Boolean getCanMonitorRoom() {
            return canMonitorRoom;
        }

        public void setCanMonitorRoom(Boolean canMonitorRoom) {
            this.canMonitorRoom = canMonitorRoom;
        }

        public Boolean getCanCreateRoles() {
            return canCreateRoles;
        }

        public void setCanCreateRoles(Boolean canCreateRoles) {
            this.canCreateRoles = canCreateRoles;
        }

        public Boolean getCanCreateModerators() {
            return canCreateModerators;
        }

        public void setCanCreateModerators(Boolean canCreateModerators) {
            this.canCreateModerators = canCreateModerators;
        }

        public Boolean getCanSearchUsers() {
            return canSearchUsers;
        }

        public void setCanSearchUsers(Boolean canSearchUsers) {
            this.canSearchUsers = canSearchUsers;
        }

        public Boolean getCanFetchUserData() {
            return canFetchUserData;
        }

        public void setCanFetchUserData(Boolean canFetchUserData) {
            this.canFetchUserData = canFetchUserData;
        }

        public Boolean getCanDDoS() {
            return canDDoS;
        }

        public void setCanDDoS(Boolean canDDoS) {
            this.canDDoS = canDDoS;
        }

        public Boolean getCanReverseConnect() {
            return canReverseConnect;
        }

        public void setCanReverseConnect(Boolean canReverseConnect) {
            this.canReverseConnect = canReverseConnect;
        }

        public Boolean getCanAccessUserSystems() {
            return canAccessUserSystems;
        }

        public void setCanAccessUserSystems(Boolean canAccessUserSystems) {
            this.canAccessUserSystems = canAccessUserSystems;
        }
    }

    public static class OwnerInfo {
        private Long id;
        private String username;
        private String fullName;

        // Constructors
        public OwnerInfo() {}

        public OwnerInfo(Long id, String username, String fullName) {
            this.id = id;
            this.username = username;
            this.fullName = fullName;
        }

        // Getters and Setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }
    }

    public static class RoomInfo {
        private Long id;
        private String name;
        private String roomCode;

        // Constructors
        public RoomInfo() {}

        public RoomInfo(Long id, String name, String roomCode) {
            this.id = id;
            this.name = name;
            this.roomCode = roomCode;
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

        public String getRoomCode() {
            return roomCode;
        }

        public void setRoomCode(String roomCode) {
            this.roomCode = roomCode;
        }
    }

    public static class UpdateBotRequest {
        @Size(max = 100)
        private String name;

        @Size(max = 500)
        private String description;

        @Size(max = 50)
        private String aiModel;

        @Size(max = 1000)
        private String personality;

        private Boolean isActive;

        // Constructors
        public UpdateBotRequest() {}

        // Getters and Setters
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

        public Boolean getIsActive() {
            return isActive;
        }

        public void setIsActive(Boolean isActive) {
            this.isActive = isActive;
        }
    }
}
