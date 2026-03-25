package com.platform.SheConnect.controller;

import java.util.List;
import java.util.Optional;

import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.session.RequestedUrlRedirectInvalidSessionStrategy;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.platform.SheConnect.dto.CreateStartUpIdeaRequest;
import com.platform.SheConnect.dto.DashboardResponse;
import com.platform.SheConnect.dto.LoginResponse;
import com.platform.SheConnect.dto.StartUpIdeaResponse;
import com.platform.SheConnect.dto.StartUpIdeaSummary;
import com.platform.SheConnect.entity.Comment;
import com.platform.SheConnect.entity.Like;
import com.platform.SheConnect.entity.StartUpIdea;
import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.repository.CommentRepository;
import com.platform.SheConnect.repository.LikeRepository;
import com.platform.SheConnect.repository.UserRepository;
import com.platform.SheConnect.service.DashboardService;
import com.platform.SheConnect.service.StartUpIdeaService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/entrepreneur")
public class EntrepreneurApiController {
    private final StartUpIdeaService startUpIdeaService;
    private final DashboardService dashboardService;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    // private  final StartUpIdeaResponse startUpIdeaResponse;

    public EntrepreneurApiController(StartUpIdeaService startUpIdeaService, DashboardService dashboardService, UserRepository userRepository, LikeRepository likeRepository, CommentRepository commentRepository) {
        this.startUpIdeaService = startUpIdeaService;
        this.dashboardService = dashboardService;
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
    
    }

    @PostMapping("/createstartup-ideas")
    public ResponseEntity<StartUpIdeaResponse> createStartUpIdea(Authentication authentication,
            @Valid @RequestBody CreateStartUpIdeaRequest request) {
        User user = (User) authentication.getPrincipal();
        String userEmail = user.getEmail();
        
        user = userRepository.findByEmail(userEmail).orElse(null);
        
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }

        StartUpIdea idea = startUpIdeaService.create(user, request);
        List<String> lookingFor = idea.getLookingFor().stream().map(n -> n.getName()).sorted().toList();
        Long likeCount = likeRepository.countByStartupIdeaId(idea.getId());
        Long commentCount = commentRepository.countByStartupIdeaId(idea.getId());
        Boolean likedByCurrentUser = likeRepository.findByStartupIdeaIdAndUserId(user.getId(), idea.getId()).isPresent();
        List<Comment> comment = commentRepository.findByStartupIdeaId(idea.getId());
        // LoginResponse loginUser = startUpIdeaResponse.mapToLoginResponse(user);

        return ResponseEntity.ok(new StartUpIdeaResponse(
                idea.getId(),
                user,
                idea.getTitle(),
                idea.getIndustry().getName(),
                lookingFor,
                idea.getUpdatedAt(),
                idea.getCreatedAt(),
                idea.getUser(),
                likeCount,
                commentCount,
                likedByCurrentUser,
                comment
        ));
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
                        i.getLikes().size()
                     
                    ))
                .toList();

        return ResponseEntity.ok(new DashboardResponse(ideaCount,user, totalLikes, totalComments, engagementRate, ideas));
    }
    // by using the id from the url get startupidea
    @GetMapping("/startup-ideas/{id}")
    public ResponseEntity<StartUpIdeaResponse> startUpIdeaId(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        StartUpIdea idea = (StartUpIdea) startUpIdeaService.getStartUpIdeasById(id);
        if (idea == null) {
            return ResponseEntity.notFound().build();
        }
        List<String> lookingFor = idea.getLookingFor().stream().map(n -> n.getName()).sorted().toList();
        Long likeCount = likeRepository.countByStartupIdeaId(idea.getId());
        Long commentCount = commentRepository.countByStartupIdeaId(idea.getId());
        Boolean likedByCurrentUser = likeRepository.findByStartupIdeaIdAndUserId(user.getId(), idea.getId()).isPresent();
        List<Comment> comment = commentRepository.findByStartupIdeaId(idea.getId());
        return ResponseEntity.ok(new StartUpIdeaResponse(
                idea.getId(),
                user,
                idea.getTitle(),
                idea.getIndustry().getName(),
                lookingFor,
                idea.getUpdatedAt(),
                idea.getCreatedAt(),
                idea.getUser(),
                likeCount,
                commentCount,
                likedByCurrentUser,
                comment
        ));
    }

    @GetMapping("/my-ideas")
    public ResponseEntity<List<StartUpIdeaResponse>> myStartUpIdea(Authentication authentication) {
        User user = (User)authentication.getPrincipal();
        List<StartUpIdea> userIdeas = startUpIdeaService.MyIdeas(user);
       
        List<StartUpIdeaResponse> response = userIdeas.stream().map(i -> new StartUpIdeaResponse(
            i.getId(),
            i.getUser(),
            i.getTitle(),
            i.getIndustry().getName(),
            i.getLookingFor().stream().map(n -> n.getName()).sorted().toList(),
            i.getUpdatedAt(),
            i.getCreatedAt(),
            user,
            likeRepository.countByStartupIdeaId(i.getId()),
            commentRepository.countByStartupIdeaId(i.getId()),
            likeRepository.findByStartupIdeaIdAndUserId(user.getId(), i.getId()).isPresent(),
            commentRepository.findByStartupIdeaId(i.getId())
        )).toList();
        return ResponseEntity.ok(response);
    }
    
}

