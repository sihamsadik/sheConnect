package com.platform.SheConnect.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.platform.SheConnect.dto.CreateStartUpIdeaRequest;
import com.platform.SheConnect.dto.DashboardResponse;
import com.platform.SheConnect.dto.StartUpIdeaResponse;
import com.platform.SheConnect.dto.StartUpIdeaSummary;
import com.platform.SheConnect.entity.StartUpIdea;
import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.repository.UserRepository;
import com.platform.SheConnect.service.DashboardService;
import com.platform.SheConnect.service.StartUpIdeaService;

@RestController
@RequestMapping("/api/entrepreneur")
public class EntrepreneurApiController {
    private final StartUpIdeaService startUpIdeaService;
    private final DashboardService dashboardService;
    private final UserRepository userRepository;

    public EntrepreneurApiController(StartUpIdeaService startUpIdeaService, DashboardService dashboardService, UserRepository userRepository) {
        this.startUpIdeaService = startUpIdeaService;
        this.dashboardService = dashboardService;
        this.userRepository = userRepository;
    }

    @PostMapping("/startup-ideas")
    public ResponseEntity<StartUpIdeaResponse> createStartUpIdea(Authentication authentication,
            @RequestBody CreateStartUpIdeaRequest request) {
        User user = (User) authentication.getPrincipal();
        String userEmail = user.getEmail();
        
        user = userRepository.findByEmail(userEmail).orElse(null);
        
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }

        StartUpIdea idea = startUpIdeaService.create(user, request);
        List<String> lookingFor = idea.getLookingFor().stream().map(n -> n.getName()).sorted().toList();

        return ResponseEntity.ok(new StartUpIdeaResponse(
                idea.getId(),
                idea.getTitle(),
                idea.getIndustry().getName(),
                lookingFor));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> dashboard(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Long userId = user.getId();

        long ideaCount = dashboardService.getIdeaCount(userId);
        int totalLikes = dashboardService.getTotalLikes(userId);
        long totalComments = dashboardService.getTotalComments(userId);
        double engagementRate = dashboardService.getEngagementRate(userId);

        List<StartUpIdeaSummary> ideas = dashboardService.getAllStartupIdeas(user).stream()
                .map(i -> new StartUpIdeaSummary(
                        i.getId(),
                        i.getTitle(),
                        i.getIndustry().getName(),
                        i.getLikes() == null ? 0 : i.getLikes()))
                .toList();

        return ResponseEntity.ok(new DashboardResponse(ideaCount, totalLikes, totalComments, engagementRate, ideas));
    }
}
