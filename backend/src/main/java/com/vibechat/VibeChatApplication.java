package com.vibechat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.EnableAsync;

import com.vibechat.service.PreMadeServerService;

@SpringBootApplication
@EnableAsync
public class VibeChatApplication {

    private final PreMadeServerService preMadeServerService;

    public VibeChatApplication(PreMadeServerService preMadeServerService) {
        this.preMadeServerService = preMadeServerService;
    }

    public static void main(String[] args) {
        SpringApplication.run(VibeChatApplication.class, args);
        System.out.println("🚀 VibeChat Backend Server Started Successfully!");
    }

    @EventListener(ApplicationReadyEvent.class)
    public void initializePreMadeServers() {
        System.out.println("🎯 Initializing VibeChat pre-made servers...");
        preMadeServerService.initializePreMadeServers();
        System.out.println("✅ Pre-made servers initialized!");
    }
}
