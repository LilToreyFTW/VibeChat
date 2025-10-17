package com.vibechat.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RoomDTO {

    public static class CreateRoomRequest {
        @NotBlank
        @Size(min = 1, max = 100)
        private String name;

        @Size(max = 500)
        private String description;

        private Integer maxMembers = 50;
        private Boolean allowBots = true;

        // Constructors
        public CreateRoomRequest() {}

        public CreateRoomRequest(String name, String description) {
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

        public Integer getMaxMembers() {
            return maxMembers;
        }

        public void setMaxMembers(Integer maxMembers) {
            this.maxMembers = maxMembers;
        }

        public Boolean getAllowBots() {
            return allowBots;
        }

        public void setAllowBots(Boolean allowBots) {
            this.allowBots = allowBots;
        }
    }

    public static class RoomResponse {
        private Long id;
        private String name;
        private String description;
        private String roomCode;
        private String roomUrl;
        private String roomImage;
        private Boolean isActive;
        private Integer maxMembers;
        private Boolean allowBots;
        private String createdAt;
        private CreatorInfo creator;

        // Constructors
        public RoomResponse() {}

        public RoomResponse(Long id, String name, String description, String roomCode,
                          String roomUrl, String roomImage, Boolean isActive, Integer maxMembers,
                          Boolean allowBots, String createdAt, CreatorInfo creator) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.roomCode = roomCode;
            this.roomUrl = roomUrl;
            this.roomImage = roomImage;
            this.isActive = isActive;
            this.maxMembers = maxMembers;
            this.allowBots = allowBots;
            this.createdAt = createdAt;
            this.creator = creator;
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

        public String getRoomCode() {
            return roomCode;
        }

        public void setRoomCode(String roomCode) {
            this.roomCode = roomCode;
        }

        public String getRoomUrl() {
            return roomUrl;
        }

        public void setRoomUrl(String roomUrl) {
            this.roomUrl = roomUrl;
        }

        public String getRoomImage() {
            return roomImage;
        }

        public void setRoomImage(String roomImage) {
            this.roomImage = roomImage;
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

        public Boolean getAllowBots() {
            return allowBots;
        }

        public void setAllowBots(Boolean allowBots) {
            this.allowBots = allowBots;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public CreatorInfo getCreator() {
            return creator;
        }

        public void setCreator(CreatorInfo creator) {
            this.creator = creator;
        }
    }

    public static class CreatorInfo {
        private Long id;
        private String username;
        private String fullName;

        // Constructors
        public CreatorInfo() {}

        public CreatorInfo(Long id, String username, String fullName) {
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

    public static class UpdateRoomRequest {
        @Size(max = 100)
        private String name;

        @Size(max = 500)
        private String description;

        private Integer maxMembers;
        private Boolean allowBots;

        // Constructors
        public UpdateRoomRequest() {}

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

        public Integer getMaxMembers() {
            return maxMembers;
        }

        public void setMaxMembers(Integer maxMembers) {
            this.maxMembers = maxMembers;
        }

        public Boolean getAllowBots() {
            return allowBots;
        }

        public void setAllowBots(Boolean allowBots) {
            this.allowBots = allowBots;
        }
    }
}
