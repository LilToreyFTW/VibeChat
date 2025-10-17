package com.vibechat.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vibechat.model.PreMadeServer;
import com.vibechat.model.User;
import com.vibechat.model.repository.PreMadeServerRepository;

@Service
@Transactional
public class PreMadeServerService {

    @Autowired
    private PreMadeServerRepository preMadeServerRepository;

    @Autowired
    private RoomService roomService;

    /**
     * Initialize the 5 pre-made servers if they don't exist
     */
    public void initializePreMadeServers() {
        if (preMadeServerRepository.count() == 0) {
            createPreMadeServers();
        }
    }

    private void createPreMadeServers() {
        // Gaming Server
        PreMadeServer gamingServer = new PreMadeServer(
            "Gaming Central",
            "The ultimate gaming community for all gamers",
            "GAMING",
            "#10B981"
        );
        gamingServer.setServerIcon("🎮");
        gamingServer.setMaxMembers(5000);
        preMadeServerRepository.save(gamingServer);

        // Study Server
        PreMadeServer studyServer = new PreMadeServer(
            "Study Hub",
            "Collaborative learning space for students and learners",
            "STUDY",
            "#F59E0B"
        );
        studyServer.setServerIcon("📚");
        studyServer.setMaxMembers(2000);
        preMadeServerRepository.save(studyServer);

        // Work Server
        PreMadeServer workServer = new PreMadeServer(
            "Workspace",
            "Professional collaboration and networking",
            "WORK",
            "#8B5CF6"
        );
        workServer.setServerIcon("💼");
        workServer.setMaxMembers(1000);
        preMadeServerRepository.save(workServer);

        // Social Server
        PreMadeServer socialServer = new PreMadeServer(
            "Social Hub",
            "Social gatherings, events, and casual conversations",
            "SOCIAL",
            "#EC4899"
        );
        socialServer.setServerIcon("🎉");
        socialServer.setMaxMembers(3000);
        preMadeServerRepository.save(socialServer);

        // General Server
        PreMadeServer generalServer = new PreMadeServer(
            "General Chat",
            "General discussions for all topics and interests",
            "GENERAL",
            "#06B6D4"
        );
        generalServer.setServerIcon("💬");
        generalServer.setMaxMembers(10000);
        preMadeServerRepository.save(generalServer);

        System.out.println("✅ Created 5 pre-made servers for VibeChat");
    }

    /**
     * Get all active pre-made servers
     */
    public List<PreMadeServer> getAllActiveServers() {
        return preMadeServerRepository.findByIsActiveTrue();
    }

    /**
     * Auto-assign a user to the least populated active server
     */
    public Optional<PreMadeServer> assignUserToServer(User user) {
        // Only assign verified users to servers
        if (!user.getEmailVerified()) {
            return Optional.empty();
        }

        Optional<PreMadeServer> leastPopulatedServer = preMadeServerRepository.findLeastPopulatedActiveServer();

        if (leastPopulatedServer.isPresent()) {
            PreMadeServer server = leastPopulatedServer.get();

            // Check if server has capacity
            if (server.getCurrentMembers() < server.getMaxMembers()) {
                server.incrementMembers();
                preMadeServerRepository.save(server);

                System.out.println("✅ Auto-assigned user " + user.getUsername() + " to server: " + server.getServerName());
                return Optional.of(server);
            }
        }

        return Optional.empty();
    }

    /**
     * Get server by name
     */
    public Optional<PreMadeServer> getServerByName(String serverName) {
        return preMadeServerRepository.findByServerName(serverName);
    }

    /**
     * Update server member count when user joins/leaves
     */
    public void updateServerMemberCount(String serverName, boolean increment) {
        Optional<PreMadeServer> serverOpt = preMadeServerRepository.findByServerName(serverName);

        if (serverOpt.isPresent()) {
            PreMadeServer server = serverOpt.get();

            if (increment) {
                server.incrementMembers();
            } else {
                server.decrementMembers();
            }

            preMadeServerRepository.save(server);
        }
    }

    /**
     * Get server statistics for admin panel
     */
    public List<PreMadeServer> getServerStatistics() {
        return preMadeServerRepository.findAll();
    }
}
