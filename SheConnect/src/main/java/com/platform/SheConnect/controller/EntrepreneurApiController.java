package com.platform.SheConnect.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.platform.SheConnect.dto.CreateStartUpIdeaRequest;
import com.platform.SheConnect.dto.DashboardResponse;
import com.platform.SheConnect.dto.StartUpIdeaResponse;
import com.platform.SheConnect.dto.StartUpIdeaSummary;
import com.platform.SheConnect.entity.Comment;
import com.platform.SheConnect.entity.StartUpIdea;
import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.exception.ResourceNotFoundException;
import com.platform.SheConnect.repository.CommentRepository;
import com.platform.SheConnect.repository.LikeRepository;
import com.platform.SheConnect.repository.UserRepository;
import com.platform.SheConnect.service.DashboardService;
import com.platform.SheConnect.service.StartUpIdeaService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/entrepreneur")
public class EntrepreneurApiController {
    private final StartUpIdeaService startUpIdeaService;
    private final DashboardService dashboardService;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final PasswordEncoder passwordEncoder;

    public EntrepreneurApiController(StartUpIdeaService startUpIdeaService, DashboardService dashboardService,
            UserRepository userRepository, LikeRepository likeRepository, CommentRepository commentRepository,
            PasswordEncoder passwordEncoder) {
        this.startUpIdeaService = startUpIdeaService;
        this.dashboardService = dashboardService;
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/createstartup-ideas")
    public ResponseEntity<StartUpIdeaResponse> createStartUpIdea(Authentication authentication,
            @Valid @RequestBody CreateStartUpIdeaRequest request) {
        log.info("Received request to create startup idea"); 
        User user = (User) authentication.getPrincipal();
        String userEmail = user.getEmail();
        log.info("Received user {} to create startup idea",userEmail); 
        
        user = userRepository.findByEmail(userEmail).orElse(null);

        
        if (user == null) {
            log.error("no user is found");
            
            throw new ResourceNotFoundException("User not found");
        }

        StartUpIdea idea = startUpIdeaService.create(user, request);
        List<String> lookingFor = idea.getLookingFor().stream().map(n -> n.getName()).sorted().toList();
        Long likeCount = likeRepository.countByStartupIdeaId(idea.getId());
        Long commentCount = commentRepository.countByStartupIdeaId(idea.getId());
        Boolean likedByCurrentUser = likeRepository.findByStartupIdeaIdAndUserId(user.getId(), idea.getId()).isPresent();
        List<Comment> comment = commentRepository.findByStartupIdeaId(idea.getId());
        // LoginResponse loginUser = startUpIdeaResponse.mapToLoginResponse(user);
        log.info("eentering in the response entity");

        return ResponseEntity.status(HttpStatus.CREATED).body(new StartUpIdeaResponse(
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
            throw new ResourceNotFoundException("Startup idea not found with id: " + id);
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

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        User resolved = null;
        if (user.getId() != null) {
            resolved = userRepository.findById(user.getId()).orElse(null);
        }
        if (resolved == null && user.getEmail() != null) {
            resolved = userRepository.findByEmail(user.getEmail()).orElse(null);
        }
        final User fullUser = (resolved != null) ? resolved : user;

        long ideaCount = fullUser.getId() != null ? dashboardService.getIdeaCount(fullUser.getId()) : 0;
        int totalLikes = fullUser.getId() != null ? dashboardService.getTotalLikes(fullUser.getId()) : 0;
        long totalComments = fullUser.getId() != null ? dashboardService.getTotalComments(fullUser.getId()) : 0;
        List<StartUpIdea> userIdeas = startUpIdeaService.MyIdeas(fullUser);

        List<StartUpIdeaResponse> ideaResponses = userIdeas.stream().map(i -> new StartUpIdeaResponse(
            i.getId(),
            i.getUser(),
            i.getTitle(),
            i.getIndustry() != null ? i.getIndustry().getName() : "General",
            i.getLookingFor() != null ? i.getLookingFor().stream().map(n -> n.getName()).sorted().toList() : List.of(),
            i.getUpdatedAt(),
            i.getCreatedAt(),
            fullUser,
            likeRepository.countByStartupIdeaId(i.getId()),
            commentRepository.countByStartupIdeaId(i.getId()),
            false,
            List.of()
        )).toList();

        java.util.Map<String, Object> profile = new java.util.HashMap<>();
        profile.put("id", fullUser.getId());
        profile.put("name", fullUser.getName());
        profile.put("email", fullUser.getEmail());
        profile.put("role", fullUser.getRole() != null ? fullUser.getRole().getName() : "ENTREPRENEUR");
        profile.put("bio", fullUser.getBio() != null ? fullUser.getBio() : "");
        profile.put("title", fullUser.getTitle() != null ? fullUser.getTitle() : "");
        profile.put("ideaCount", ideaCount);
        profile.put("totalLikes", totalLikes);
        profile.put("totalComments", totalComments);
        profile.put("ideas", ideaResponses);

        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody java.util.Map<String, String> updates) {
        User user = (User) authentication.getPrincipal();
        User fullUser = null;
        if (user.getId() != null) {
            fullUser = userRepository.findById(user.getId()).orElse(null);
        }
        if (fullUser == null && user.getEmail() != null) {
            fullUser = userRepository.findByEmail(user.getEmail()).orElse(null);
        }
        if (fullUser == null) {
            throw new ResourceNotFoundException("User not found");
        }

        if (updates.containsKey("name") && updates.get("name") != null && !updates.get("name").trim().isBlank()) {
            fullUser.setName(updates.get("name").trim());
        }
        if (updates.containsKey("bio")) {
            fullUser.setBio(updates.get("bio") != null ? updates.get("bio").trim() : "");
        }
        if (updates.containsKey("title")) {
            fullUser.setTitle(updates.get("title") != null ? updates.get("title").trim() : "");
        }

        userRepository.save(fullUser);

        java.util.Map<String, Object> resp = new java.util.HashMap<>();
        resp.put("id", fullUser.getId());
        resp.put("name", fullUser.getName());
        resp.put("email", fullUser.getEmail());
        resp.put("role", fullUser.getRole() != null ? fullUser.getRole().getName() : "ENTREPRENEUR");
        resp.put("bio", fullUser.getBio() != null ? fullUser.getBio() : "");
        resp.put("title", fullUser.getTitle() != null ? fullUser.getTitle() : "");
        return ResponseEntity.ok(resp);
    }

    // ------------------------------------------------------------------
    // GET /api/entrepreneur/settings
    // ------------------------------------------------------------------

    @GetMapping("/settings")
    public ResponseEntity<Map<String, Object>> getSettings(Authentication authentication) {
        User user = resolveUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(buildSettingsDto(user));
    }

    // ------------------------------------------------------------------
    // PUT /api/entrepreneur/settings
    // ------------------------------------------------------------------

    @PutMapping("/settings")
    public ResponseEntity<Map<String, Object>> updateSettings(
            Authentication authentication,
            @RequestBody Map<String, String> updates) {
        User user = resolveUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();
        if (updates.containsKey("name") && updates.get("name") != null && !updates.get("name").isBlank())
            user.setName(updates.get("name").trim());
        if (updates.containsKey("title"))
            user.setTitle(updates.get("title") != null ? updates.get("title").trim() : "");
        if (updates.containsKey("bio"))
            user.setBio(updates.get("bio") != null ? updates.get("bio").trim() : "");
        userRepository.save(user);
        return ResponseEntity.ok(buildSettingsDto(user));
    }

    // ------------------------------------------------------------------
    // PUT /api/entrepreneur/settings/password
    // ------------------------------------------------------------------

    @PutMapping("/settings/password")
    public ResponseEntity<Map<String, String>> changePassword(
            Authentication authentication,
            @RequestBody Map<String, String> body) {
        User user = resolveUser(authentication);
        if (user == null) return ResponseEntity.status(401).build();
        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");
        if (currentPassword == null || newPassword == null)
            return ResponseEntity.badRequest().body(Map.of("error", "Both currentPassword and newPassword are required."));
        if (!passwordEncoder.matches(currentPassword, user.getPassword()))
            return ResponseEntity.badRequest().body(Map.of("error", "Current password is incorrect."));
        if (newPassword.length() < 6)
            return ResponseEntity.badRequest().body(Map.of("error", "New password must be at least 6 characters."));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Password updated successfully."));
    }

    // ------------------------------------------------------------------
    // Helper: resolve authenticated user from DB
    // ------------------------------------------------------------------

    private User resolveUser(Authentication authentication) {
        if (authentication == null) return null;
        Object principal = authentication.getPrincipal();
        if (principal instanceof User u) {
            if (u.getId() != null) return userRepository.findById(u.getId()).orElse(u);
            if (u.getEmail() != null) return userRepository.findByEmail(u.getEmail()).orElse(u);
        } else if (principal instanceof org.springframework.security.core.userdetails.UserDetails ud) {
            return userRepository.findByEmail(ud.getUsername()).orElse(null);
        } else if (principal instanceof String s && !s.equalsIgnoreCase("anonymousUser")) {
            return userRepository.findByEmail(s).orElse(null);
        }
        return null;
    }

    private Map<String, Object> buildSettingsDto(User user) {
        Map<String, Object> dto = new java.util.HashMap<>();
        dto.put("name", user.getName());
        dto.put("email", user.getEmail());
        dto.put("title", user.getTitle() != null ? user.getTitle() : "");
        dto.put("bio", user.getBio() != null ? user.getBio() : "");
        return dto;
    }
}
