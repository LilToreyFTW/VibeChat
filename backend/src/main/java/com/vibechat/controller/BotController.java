package com.vibechat.controller;

import com.vibechat.model.dto.BotDTO;
import com.vibechat.service.BotService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bots")
@CrossOrigin(origins = "*")
public class BotController {

    @Autowired
    private BotService botService;

    @PostMapping
    public ResponseEntity<?> createBot(@Valid @RequestBody BotDTO.CreateBotRequest request,
                                     @RequestHeader("X-User-Username") String username) {
        try {
            BotDTO.BotResponse botResponse = botService.createBot(request, username);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Bot created successfully");
            response.put("bot", botResponse);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/my-bots")
    public ResponseEntity<?> getMyBots(@RequestHeader("X-User-Username") String username) {
        try {
            List<BotDTO.BotResponse> bots = botService.getUserBots(username);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("bots", bots);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/room/{roomId}")
    public ResponseEntity<?> getRoomBots(@PathVariable Long roomId) {
        try {
            List<BotDTO.BotResponse> bots = botService.getRoomBots(roomId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("bots", bots);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{botId}")
    public ResponseEntity<?> updateBot(@PathVariable Long botId,
                                     @Valid @RequestBody BotDTO.UpdateBotRequest request,
                                     @RequestHeader("X-User-Username") String username) {
        try {
            BotDTO.BotResponse botResponse = botService.updateBot(botId, request, username);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Bot updated successfully");
            response.put("bot", botResponse);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{botId}")
    public ResponseEntity<?> deleteBot(@PathVariable Long botId,
                                     @RequestHeader("X-User-Username") String username) {
        try {
            botService.deleteBot(botId, username);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Bot deleted successfully");

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{botId}/download")
    public ResponseEntity<?> downloadBotFile(@PathVariable Long botId,
                                           @RequestHeader("X-User-Username") String username) {
        try {
            String pythonCode = botService.generateBotPythonFile(botId, username);

            return ResponseEntity.ok()
                    .header("Content-Type", "text/plain")
                    .header("Content-Disposition", "attachment; filename=\"vibechat_bot.py\"")
                    .body(pythonCode);

        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }
}
