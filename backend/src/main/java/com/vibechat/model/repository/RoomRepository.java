package com.vibechat.model.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vibechat.model.Room;
import com.vibechat.model.User;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    Optional<Room> findByRoomCode(String roomCode);

    Optional<Room> findByRoomUrl(String roomUrl);

    List<Room> findByCreator(User creator);

    List<Room> findByIsActive(Boolean isActive);

    Boolean existsByRoomCode(String roomCode);

    Boolean existsByRoomUrl(String roomUrl);
}
