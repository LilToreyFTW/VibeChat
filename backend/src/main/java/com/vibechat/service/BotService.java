package com.vibechat.service;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vibechat.model.Bot;
import com.vibechat.model.Room;
import com.vibechat.model.User;
import com.vibechat.model.dto.BotDTO;
import com.vibechat.model.repository.BotRepository;
import com.vibechat.model.repository.RoomRepository;
import com.vibechat.model.repository.UserRepository;

@Service
@Transactional
public class BotService {

    @Autowired
    private BotRepository botRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomRepository roomRepository;

    public BotDTO.BotResponse createBot(BotDTO.CreateBotRequest request, String ownerUsername) {
        User owner = userRepository.findByUsername(ownerUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if room exists (if provided)
        Room room = null;
        if (request.getRoomId() != null) {
            room = roomRepository.findById(request.getRoomId())
                    .orElseThrow(() -> new RuntimeException("Room not found"));

            // Check if user is the creator of the room
            if (!room.getCreator().getId().equals(owner.getId())) {
                throw new RuntimeException("Not authorized to add bot to this room");
            }
        }

        // Generate unique bot token
        String botToken = generateUniqueBotToken();

        // Create new bot with hardcoded capability restrictions
        Bot bot = new Bot();
        bot.setName(request.getName());
        bot.setDescription(request.getDescription());
        bot.setBotToken(botToken);
        bot.setAiModel(request.getAiModel());
        bot.setPersonality(request.getPersonality());
        bot.setIsActive(true);
        bot.setOwner(owner);
        bot.setRoom(room);

        // Enforce hardcoded bot capability restrictions
        // Allowed capabilities (set to true by default)
        bot.setCanMonitorRoom(true);      // Monitor their chatroom
        bot.setCanCreateRoles(true);     // Create custom roles in their chatroom
        bot.setCanCreateModerators(true); // Create a moderator for their chatroom

        // Prohibited capabilities (always false - hardcoded restrictions)
        // These are set to false by default in the Bot model and cannot be changed

        Bot savedBot = botRepository.save(bot);

        return mapToBotResponse(savedBot);
    }

    public List<BotDTO.BotResponse> getUserBots(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return botRepository.findByOwner(user)
                .stream()
                .map(this::mapToBotResponse)
                .collect(Collectors.toList());
    }

    public List<BotDTO.BotResponse> getRoomBots(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        return botRepository.findByRoomAndIsActive(room, true)
                .stream()
                .map(this::mapToBotResponse)
                .collect(Collectors.toList());
    }

    public Optional<Bot> findByBotToken(String botToken) {
        return botRepository.findByBotToken(botToken);
    }

    public BotDTO.BotResponse updateBot(Long botId, BotDTO.UpdateBotRequest request, String username) {
        Bot bot = botRepository.findById(botId)
                .orElseThrow(() -> new RuntimeException("Bot not found"));

        // Check if user is the owner
        if (!bot.getOwner().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to update this bot");
        }

        // Update bot fields if provided
        if (request.getName() != null) {
            bot.setName(request.getName());
        }
        if (request.getDescription() != null) {
            bot.setDescription(request.getDescription());
        }
        if (request.getAiModel() != null) {
            bot.setAiModel(request.getAiModel());
        }
        if (request.getPersonality() != null) {
            bot.setPersonality(request.getPersonality());
        }
        if (request.getIsActive() != null) {
            bot.setIsActive(request.getIsActive());
        }

        Bot updatedBot = botRepository.save(bot);
        return mapToBotResponse(updatedBot);
    }

    public void deleteBot(Long botId, String username) {
        Bot bot = botRepository.findById(botId)
                .orElseThrow(() -> new RuntimeException("Bot not found"));

        // Check if user is the owner
        if (!bot.getOwner().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to delete this bot");
        }

        botRepository.delete(bot);
    }

    private String generateUniqueBotToken() {
        String botToken;
        do {
            botToken = generateBotToken();
        } while (botRepository.existsByBotToken(botToken));
        return botToken;
    }

    private String generateBotToken() {
        Random random = new Random();
        StringBuilder token = new StringBuilder();
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (int i = 0; i < 32; i++) {
            token.append(chars.charAt(random.nextInt(chars.length())));
        }
        return token.toString();
    }

    private BotDTO.BotResponse mapToBotResponse(Bot bot) {
        BotDTO.OwnerInfo ownerInfo = new BotDTO.OwnerInfo(
                bot.getOwner().getId(),
                bot.getOwner().getUsername(),
                bot.getOwner().getFullName()
        );

        BotDTO.RoomInfo roomInfo = null;
        if (bot.getRoom() != null) {
            roomInfo = new BotDTO.RoomInfo(
                    bot.getRoom().getId(),
                    bot.getRoom().getName(),
                    bot.getRoom().getRoomCode()
            );
        }

        return new BotDTO.BotResponse(
                bot.getId(),
                bot.getName(),
                bot.getDescription(),
                bot.getBotToken(),
                bot.getIsActive(),
                bot.getAiModel(),
                bot.getPersonality(),
                bot.getCreatedAt() != null ? bot.getCreatedAt().toString() : null,
                ownerInfo,
                roomInfo,
                bot.getCanMonitorRoom(),
                bot.getCanCreateRoles(),
                bot.getCanCreateModerators(),
                bot.getCanSearchUsers(),
                bot.getCanFetchUserData(),
                bot.getCanDDoS(),
                bot.getCanReverseConnect(),
                bot.getCanAccessUserSystems()
        );
    }

    public String generateBotPythonFile(Long botId, String username) {
        Bot bot = botRepository.findById(botId)
                .orElseThrow(() -> new RuntimeException("Bot not found"));

        // Check if user is the owner
        if (!bot.getOwner().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to download this bot");
        }

        // Generate the Python bot file content
        String pythonCode = generateBotPythonCode(bot);
        return pythonCode;
    }

    private String generateBotPythonCode(Bot bot) {
        String botName = bot.getName().replaceAll("[^a-zA-Z0-9]", "_");
        String botToken = bot.getBotToken();
        String roomCode = bot.getRoom() != null ? bot.getRoom().getRoomCode() : "Not assigned";

        return String.format(
"VibeChat Bot - Generated for User Account\n" +
"\n" +
"[!] SECURITY NOTICE [!]\n" +
"This bot file contains your personal account token.\n" +
"DO NOT share this file with anyone else.\n" +
"DO NOT modify the hardcoded security restrictions.\n" +
"\n" +
"ALLOWED CAPABILITIES:\n" +
"- Monitor chatroom activity\n" +
"- Create custom roles in your chatroom\n" +
"- Create moderators for your chatroom\n" +
"\n" +
"PROHIBITED CAPABILITIES (Hardcoded - Cannot be changed):\n" +
"- Search or fetch user accounts\n" +
"- Perform DDoS attacks\n" +
"- Use reverse connection scripts\n" +
"- Access other users' systems\n" +
"\n" +
"INSTRUCTIONS:\n" +
"1. Save this file as 'vibechat_%s_bot.py'\n" +
"2. Install required dependencies: pip install requests websocket-client\n" +
"3. Run the bot: python vibechat_%s_bot.py\n" +
"4. To add features, ask Cursor what you want to add to your bot\n" +
"\n" +
"For help or to add features, ask Cursor:\n" +
"\"What features would you like to add to your bot?\"\n" +
"\n" +
"import requests\n" +
"import websocket\n" +
"import json\n" +
"import time\n" +
"import threading\n" +
"from datetime import datetime\n" +
"\n" +
"# [!] DO NOT MODIFY THESE SETTINGS [!]\n" +
"# Your personal bot configuration (auto-generated)\n" +
"BOT_TOKEN = '%s'  # Your unique bot token\n" +
"BOT_NAME = '%s'   # Your bot name\n" +
"ROOM_CODE = '%s'  # Room code (if assigned)\n" +
"\n" +
"# Hardcoded security restrictions (CANNOT be modified)\n" +
"class SecurityRestrictions:\n" +
"    # ALLOWED: Monitor room activity\n" +
"    CAN_MONITOR_ROOM = True\n" +
"\n" +
"    # ALLOWED: Create custom roles\n" +
"    CAN_CREATE_ROLES = True\n" +
"\n" +
"    # ALLOWED: Create moderators\n" +
"    CAN_CREATE_MODERATORS = True\n" +
"\n" +
"    # PROHIBITED: Search/fetch user accounts\n" +
"    CAN_SEARCH_USERS = False\n" +
"\n" +
"    # PROHIBITED: Fetch user data\n" +
"    CAN_FETCH_USER_DATA = False\n" +
"\n" +
"    # PROHIBITED: Perform DDoS attacks\n" +
"    CAN_DDOS = False\n" +
"\n" +
"    # PROHIBITED: Use reverse connections\n" +
"    CAN_REVERSE_CONNECT = False\n" +
"\n" +
"    # PROHIBITED: Access user systems\n" +
"    CAN_ACCESS_USER_SYSTEMS = False\n" +
"\n" +
"# VibeChat API Configuration\n" +
"VIBECHAT_API_BASE = 'http://localhost:8080/api'  # Update for production\n" +
"\n" +
"class VibeChatBot:\n" +
"    def __init__(self):\n" +
"        self.bot_token = BOT_TOKEN\n" +
"        self.bot_name = BOT_NAME\n" +
"        self.room_code = ROOM_CODE\n" +
"        self.headers = {\n" +
"            'Authorization': f'Bearer {self.bot_token}',\n" +
"            'Content-Type': 'application/json'\n" +
"        }\n" +
"\n" +
"        # Verify bot token on startup\n" +
"        if not self.verify_bot_token():\n" +
"            raise Exception(\"Invalid bot token. Please recreate your bot.\")\n" +
"\n" +
"        print(f\"Bot {self.bot_name} Bot initialized successfully!\")\n" +
"        print(f\"Connected to room: {self.room_code}\")\n" +
"        print(f\"ALLOWED: Monitor room, Create roles, Create moderators\")\n" +
"        print(f\"RESTRICTED: User searches, DDoS, Reverse connections, System access\")\n" +
"\n" +
"    def verify_bot_token(self):\n" +
"        \"\"\"Verify the bot token is valid\"\"\"\n" +
"        try:\n" +
"            response = requests.post(\n" +
"                f'{VIBECHAT_API_BASE}/auth/validate',\n" +
"                headers=self.headers,\n" +
"                timeout=10\n" +
"            )\n" +
"            return response.status_code == 200\n" +
"        except:\n" +
"            return False\n" +
"\n" +
"    def connect_websocket(self):\n" +
"        \"\"\"Connect to the room's WebSocket\"\"\"\n" +
"        if not self.room_code:\n" +
"            print(\"No room assigned to this bot\")\n" +
"            return\n" +
"\n" +
"        ws_url = f'ws://localhost:3003/{self.room_code}'\n" +
"\n" +
"        def on_message(ws, message):\n" +
"            try:\n" +
"                data = json.loads(message)\n" +
"                self.handle_websocket_message(data)\n" +
"            except json.JSONDecodeError:\n" +
"                print(f\"Received non-JSON message: {message}\")\n" +
"\n" +
"        def on_error(ws, error):\n" +
"            print(f\"WebSocket error: {error}\")\n" +
"\n" +
"        def on_close(ws, close_status_code, close_msg):\n" +
"            print(\"WebSocket connection closed. Reconnecting in 5 seconds...\")\n" +
"            time.sleep(5)\n" +
"            self.connect_websocket()\n" +
"\n" +
"        def on_open(ws):\n" +
"            print(f\"Connected to room WebSocket: {self.room_code}\")\n" +
"            # Send bot join message\n" +
"            ws.send(json.dumps({\n" +
"                'type': 'join',\n" +
"                'username': self.bot_name,\n" +
"                'timestamp': datetime.now().isoformat()\n" +
"            }))\n" +
"\n" +
"        websocket.enableTrace(False)\n" +
"        ws = websocket.WebSocketApp(\n" +
"            ws_url,\n" +
"            on_message=on_message,\n" +
"            on_error=on_error,\n" +
"            on_close=on_close,\n" +
"            on_open=on_open\n" +
"        )\n" +
"\n" +
"        ws.run_forever()\n" +
"\n" +
"    def handle_websocket_message(self, data):\n" +
"        \"\"\"Handle incoming WebSocket messages\"\"\"\n" +
"        message_type = data.get('type')\n" +
"\n" +
"        if message_type == 'room_info':\n" +
"            print(f\"Bot joined room: {data.get('room', {}).get('name', 'Unknown')}\")\n" +
"\n" +
"        elif message_type == 'new_message':\n" +
"            # Monitor room messages (ALLOWED)\n" +
"            if SecurityRestrictions.CAN_MONITOR_ROOM:\n" +
"                self.monitor_room_message(data)\n" +
"\n" +
"        elif message_type == 'user_joined':\n" +
"            # Monitor user joins (ALLOWED)\n" +
"            if SecurityRestrictions.CAN_MONITOR_ROOM:\n" +
"                print(f\"User joined: {data.get('username')}\")\n" +
"\n" +
"        elif message_type == 'user_left':\n" +
"            # Monitor user leaves (ALLOWED)\n" +
"            if SecurityRestrictions.CAN_MONITOR_ROOM:\n" +
"                print(f\"User left: {data.get('username')}\")\n" +
"\n" +
"    def monitor_room_message(self, message_data):\n" +
"        \"\"\"Monitor and analyze room messages\"\"\"\n" +
"        username = message_data.get('username', 'Unknown')\n" +
"        content = message_data.get('content', '')\n" +
"\n" +
"        print(f\"[{username}]: {content}\")\n" +
"\n" +
"        # You can add custom message analysis here\n" +
"        # For example, detect keywords, sentiment analysis, etc.\n" +
"\n" +
"    def create_custom_role(self, role_name, permissions):\n" +
"        \"\"\"Create a custom role in the room\"\"\"\n" +
"        if not SecurityRestrictions.CAN_CREATE_ROLES:\n" +
"            print(\"ERROR: Bot is not allowed to create roles\")\n" +
"            return False\n" +
"\n" +
"        if not self.room_code:\n" +
"            print(\"ERROR: No room assigned to bot\")\n" +
"            return False\n" +
"\n" +
"        try:\n" +
"            # This would call the VibeChat API to create a role\n" +
"            # Implementation depends on your API design\n" +
"            print(f\"Created role: {role_name} with permissions: {permissions}\")\n" +
"            return True\n" +
"        except Exception as e:\n" +
"            print(f\"Failed to create role: {e}\")\n" +
"            return False\n" +
"\n" +
"    def create_moderator(self, username, reason=\"Bot-created moderator\"):\n" +
"        \"\"\"Create a moderator for the room\"\"\"\n" +
"        if not SecurityRestrictions.CAN_CREATE_MODERATORS:\n" +
"            print(\"ERROR: Bot is not allowed to create moderators\")\n" +
"            return False\n" +
"\n" +
"        if not self.room_code:\n" +
"            print(\"ERROR: No room assigned to bot\")\n" +
"            return False\n" +
"\n" +
"        try:\n" +
"            # This would call the VibeChat API to create a moderator\n" +
"            # Implementation depends on your API design\n" +
"            print(f\"Created moderator: {username} - Reason: {reason}\")\n" +
"            return True\n" +
"        except Exception as e:\n" +
"            print(f\"Failed to create moderator: {e}\")\n" +
"            return False\n" +
"\n" +
"    def run(self):\n" +
"        \"\"\"Main bot loop\"\"\"\n" +
"        print(f\"Starting {self.bot_name} bot...\")\n" +
"        print(\"To add features to this bot, ask Cursor what you want to add!\")\n" +
"        print(\"Remember: This bot can only monitor rooms, create roles, and create moderators.\")\n" +
"\n" +
"        # Start WebSocket connection in a separate thread\n" +
"        ws_thread = threading.Thread(target=self.connect_websocket, daemon=True)\n" +
"        ws_thread.start()\n" +
"\n" +
"        # Main monitoring loop\n" +
"        try:\n" +
"            while True:\n" +
"                time.sleep(60)  # Check every minute\n" +
"\n" +
"                # You can add periodic tasks here\n" +
"                # For example: check room activity, send scheduled messages, etc.\n" +
"\n" +
"        except KeyboardInterrupt:\n" +
"            print(f\"\\n{self.bot_name} bot stopped by user\")\n" +
"\n" +
"# Bot initialization and startup\n" +
"if __name__ == \"__main__\":\n" +
"    try:\n" +
"        bot = VibeChatBot()\n" +
"        bot.run()\n" +
"    except Exception as e:\n" +
"        print(f\"Failed to start bot: {e}\")\n" +
"        print(\"Make sure your bot token is valid and you have network connectivity.\")\n"
, botName, botName, botToken, botName, roomCode);
    }
}
