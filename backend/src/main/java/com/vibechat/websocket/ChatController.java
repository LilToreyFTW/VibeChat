package com.vibechat.websocket;

import com.vibechat.websocket.dto.ChatMessage;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
public class ChatController {

    @MessageMapping("/chat/{roomCode}/sendMessage")
    @SendTo("/topic/chat/{roomCode}")
    public ChatMessage sendMessage(@DestinationVariable String roomCode,
                                 @Payload ChatMessage chatMessage,
                                 SimpMessageHeaderAccessor headerAccessor) {

        // Set timestamp
        chatMessage.setTimestamp(LocalDateTime.now().toString());

        // Here you could add validation, save to database, etc.
        // For now, we'll just pass the message through

        return chatMessage;
    }

    @MessageMapping("/chat/{roomCode}/addUser")
    @SendTo("/topic/chat/{roomCode}")
    public ChatMessage addUser(@DestinationVariable String roomCode,
                             @Payload ChatMessage chatMessage,
                             SimpMessageHeaderAccessor headerAccessor) {

        // Add user to the room
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());

        // Create system message about user joining
        ChatMessage joinMessage = new ChatMessage();
        joinMessage.setType(ChatMessage.MessageType.JOIN);
        joinMessage.setSender("System");
        joinMessage.setContent(chatMessage.getSender() + " joined the room");
        joinMessage.setTimestamp(LocalDateTime.now().toString());

        return joinMessage;
    }
}
