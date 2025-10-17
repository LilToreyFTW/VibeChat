package com.vibechat.service;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vibechat.model.Room;
import com.vibechat.model.User;
import com.vibechat.model.dto.RoomDTO;
import com.vibechat.model.repository.RoomRepository;
import com.vibechat.model.repository.UserRepository;

@Service
@Transactional
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${vibechat.room.base-url}")
    private String baseRoomUrl;

    @Value("${vibechat.room.code-length}")
    private int roomCodeLength;

    public RoomDTO.RoomResponse createRoom(RoomDTO.CreateRoomRequest request, String creatorUsername) {
        User creator = userRepository.findByUsername(creatorUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate unique room code and URL
        String roomCode = generateUniqueRoomCode();
        String roomUrl = baseRoomUrl + "/" + roomCode;

        // Create new room
        Room room = new Room();
        room.setName(request.getName());
        room.setDescription(request.getDescription());
        room.setRoomCode(roomCode);
        room.setRoomUrl(roomUrl);
        room.setMaxMembers(request.getMaxMembers());
        room.setAllowBots(request.getAllowBots());
        room.setIsActive(true);
        room.setCreator(creator);

        Room savedRoom = roomRepository.save(room);

        return mapToRoomResponse(savedRoom);
    }

    public List<RoomDTO.RoomResponse> getUserRooms(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return roomRepository.findByCreator(user)
                .stream()
                .map(this::mapToRoomResponse)
                .collect(Collectors.toList());
    }

    public Optional<RoomDTO.RoomResponse> getRoomByCode(String roomCode) {
        return roomRepository.findByRoomCode(roomCode)
                .map(this::mapToRoomResponse);
    }

    public RoomDTO.RoomResponse updateRoom(Long roomId, RoomDTO.UpdateRoomRequest request, String username) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // Check if user is the creator
        if (!room.getCreator().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to update this room");
        }

        // Update room fields if provided
        if (request.getName() != null) {
            room.setName(request.getName());
        }
        if (request.getDescription() != null) {
            room.setDescription(request.getDescription());
        }
        if (request.getMaxMembers() != null) {
            room.setMaxMembers(request.getMaxMembers());
        }
        if (request.getAllowBots() != null) {
            room.setAllowBots(request.getAllowBots());
        }

        Room updatedRoom = roomRepository.save(room);
        return mapToRoomResponse(updatedRoom);
    }

    public void deleteRoom(Long roomId, String username) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // Check if user is the creator
        if (!room.getCreator().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to delete this room");
        }

        roomRepository.delete(room);
    }

    private String generateUniqueRoomCode() {
        String roomCode;
        do {
            roomCode = generateRoomCode();
        } while (roomRepository.existsByRoomCode(roomCode));
        return roomCode;
    }

    private String generateRoomCode() {
        Random random = new Random();
        StringBuilder roomCode = new StringBuilder();
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        for (int i = 0; i < roomCodeLength; i++) {
            roomCode.append(chars.charAt(random.nextInt(chars.length())));
        }
        return roomCode.toString();
    }

    private RoomDTO.RoomResponse mapToRoomResponse(Room room) {
        RoomDTO.CreatorInfo creatorInfo = new RoomDTO.CreatorInfo(
                room.getCreator().getId(),
                room.getCreator().getUsername(),
                room.getCreator().getFullName()
        );

        return new RoomDTO.RoomResponse(
                room.getId(),
                room.getName(),
                room.getDescription(),
                room.getRoomCode(),
                room.getRoomUrl(),
                room.getRoomImage(),
                room.getIsActive(),
                room.getMaxMembers(),
                room.getAllowBots(),
                room.getCreatedAt() != null ? room.getCreatedAt().toString() : null,
                creatorInfo
        );
    }
}
