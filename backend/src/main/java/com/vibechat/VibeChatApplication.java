package com.vibechat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class VibeChatApplication {

    public static void main(String[] args) {
        SpringApplication.run(VibeChatApplication.class, args);
        System.out.println("🚀 VibeChat Backend Server Started Successfully!");
    }
}
