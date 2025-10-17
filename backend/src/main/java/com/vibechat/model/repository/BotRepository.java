package com.vibechat.model.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.vibechat.model.Bot;
import com.vibechat.model.Room;
import com.vibechat.model.User;

@Repository
public interface BotRepository extends JpaRepository<Bot, Long> {

    Optional<Bot> findByBotToken(String botToken);

    List<Bot> findByOwner(User owner);

    List<Bot> findByRoom(Room room);

    List<Bot> findByOwnerAndIsActive(User owner, Boolean isActive);

    List<Bot> findByRoomAndIsActive(Room room, Boolean isActive);

    Boolean existsByBotToken(String botToken);
}
