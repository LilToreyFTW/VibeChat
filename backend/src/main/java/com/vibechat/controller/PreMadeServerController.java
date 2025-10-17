package com.vibechat.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vibechat.model.PreMadeServer;
import com.vibechat.service.PreMadeServerService;

@RestController
@RequestMapping("/api/pre-made-servers")
public class PreMadeServerController {

    @Autowired
    private PreMadeServerService preMadeServerService;

    @GetMapping
    public ResponseEntity<List<PreMadeServer>> getAllActiveServers() {
        List<PreMadeServer> servers = preMadeServerService.getAllActiveServers();
        return ResponseEntity.ok(servers);
    }

    @GetMapping("/{serverName}")
    public ResponseEntity<PreMadeServer> getServerByName(@PathVariable String serverName) {
        Optional<PreMadeServer> server = preMadeServerService.getServerByName(serverName);
        return server.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    public ResponseEntity<List<PreMadeServer>> getServerStatistics() {
        List<PreMadeServer> stats = preMadeServerService.getServerStatistics();
        return ResponseEntity.ok(stats);
    }
}
