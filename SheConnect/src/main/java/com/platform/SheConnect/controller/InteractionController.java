package com.platform.SheConnect.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.platform.SheConnect.dto.CommentRequestDto;
import com.platform.SheConnect.dto.LikeResponse;
import com.platform.SheConnect.dto.StartUpIdeaResponse;
import com.platform.SheConnect.entity.AdvisorMentorship;
import com.platform.SheConnect.entity.Comment;
import com.platform.SheConnect.entity.StartUpIdea;
import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.exception.ResourceNotFoundException;
import com.platform.SheConnect.repository.CommentRepository;
import com.platform.SheConnect.repository.LikeRepository;
import com.platform.SheConnect.repository.StartUpIdeaRepository;
import com.platform.SheConnect.repository.UserRepository;
import com.platform.SheConnect.service.InteractionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/interactions")
public class InteractionController {
    private static final Logger log = LoggerFactory.getLogger(InteractionController.class);
    private final InteractionService interactionService;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final StartUpIdeaRepository startUpIdeaRepository;
    private final LikeRepository likeRepository;

    public InteractionController(
            InteractionService interactionService,
            UserRepository userRepository,
            CommentRepository commentRepository,
            StartUpIdeaRepository startUpIdeaRepository,
            LikeRepository likeRepository
    ) {
        this.interactionService = interactionService;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
        this.startUpIdeaRepository = startUpIdeaRepository;
        this.likeRepository = likeRepository;
    }

    private Long resolveUserId(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return null;
        }
        User principal = (User) authentication.getPrincipal();
        if (principal.getId() != null) {
            return principal.getId();
        }
        return userRepository.findByEmail(principal.getEmail())
                .map(User::getId)
                .orElse(null);
    }

    @PostMapping("startup-ideas/{id}/comment")
    public ResponseEntity<?> commentOnStartupIdea(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody CommentRequestDto commentRequest
    ) {
        Long userId = resolveUserId(authentication);
        if (userId == null) {
            throw new ResourceNotFoundException("User not found");
        }
        String content = commentRequest.getContent();
        if (content == null || content.isBlank()) {
            throw new IllegalArgumentException("Comment content is required");
        }

        Comment comment = interactionService.addCommentToStartupIdea(id, userId, content);

        Map<String, Object> resp = new HashMap<>();
        resp.put("id", comment.getId());
        resp.put("commentId", comment.getId());
        resp.put("content", comment.getContent());
        resp.put("userId", comment.getUser().getId());
        resp.put("authorName", comment.getUser().getName());
        resp.put("authorRole", comment.getUser().getRole() != null ? comment.getUser().getRole().getName() : "");
        resp.put("startupIdeaId", comment.getStartupIdea().getId());
        resp.put("createdAt", comment.getCreatedAt());

        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @GetMapping("startup-ideas/{id}/comments")
    public ResponseEntity<List<Map<String, Object>>> getCommentsForStartupIdea(@PathVariable Long id) {
        List<Comment> comments = commentRepository.findByStartupIdeaId(id);
        List<Map<String, Object>> resp = comments.stream().map(c -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("content", c.getContent());
            map.put("userId", c.getUser() != null ? c.getUser().getId() : null);
            map.put("authorName", c.getUser() != null ? c.getUser().getName() : "Anonymous");
            map.put("authorRole", (c.getUser() != null && c.getUser().getRole() != null) ? c.getUser().getRole().getName() : "");
            map.put("createdAt", c.getCreatedAt());
            return map;
        }).toList();
        return ResponseEntity.ok(resp);
    }

    @RequestMapping(value = "startup-ideas/{id}/like", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<LikeResponse> likeStartupIdea(Authentication authentication, @PathVariable Long id) {
        Long userId = resolveUserId(authentication);
        if (userId == null) {
            throw new ResourceNotFoundException("User not found");
        }

        if (interactionService.hasUserLikedStartupIdea(id, userId)) {
            interactionService.unlikeStartupIdea(id, userId);
            return ResponseEntity.ok(new LikeResponse(interactionService.countLikesByStartupIdeaId(id), false));
        } else {
            interactionService.likeStartupIdea(id, userId);
            return ResponseEntity.ok(new LikeResponse(interactionService.countLikesByStartupIdeaId(id), true));
        }
    }

    @PostMapping("startup-ideas/{id}/mentorship-offer")
    public ResponseEntity<Map<String, Object>> offerMentorship(
            Authentication authentication,
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> request
    ) {
        Long userId = resolveUserId(authentication);
        if (userId == null) {
            throw new ResourceNotFoundException("User not found");
        }

        String message = request != null ? request.get("message") : null;
        AdvisorMentorship mentorship = interactionService.offerMentorship(id, userId, message);

        Map<String, Object> resp = new HashMap<>();
        resp.put("id", mentorship.getId());
        resp.put("status", mentorship.getStatus());
        resp.put("startupIdeaId", mentorship.getStartupIdea() != null ? mentorship.getStartupIdea().getId() : id);
        resp.put("message", "Mentorship offer saved");
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    @GetMapping("/ideas")
    public ResponseEntity<List<StartUpIdeaResponse>> getAllStartupIdeas(Authentication authentication) {
        final Long currentUserId = resolveUserId(authentication);
        List<StartUpIdea> allIdeas = startUpIdeaRepository.findAll();

        List<StartUpIdeaResponse> response = allIdeas.stream().map(i -> {
            Long likeCount = likeRepository.countByStartupIdeaId(i.getId());
            Long commentCount = commentRepository.countByStartupIdeaId(i.getId());
            Boolean likedByCurrentUser = currentUserId != null && likeRepository.findByStartupIdeaIdAndUserId(i.getId(), currentUserId).isPresent();
            List<Comment> comments = commentRepository.findByStartupIdeaId(i.getId());

            return new StartUpIdeaResponse(
                    i.getId(),
                    i.getUser(),
                    i.getTitle(),
                    i.getIndustry() != null ? i.getIndustry().getName() : "General",
                    i.getDescription(),
                    i.getProblem(),
                    i.getSolution(),
                    i.getLookingFor() != null ? i.getLookingFor().stream().map(n -> n.getName()).sorted().toList() : List.of(),
                    i.getUpdatedAt(),
                    i.getCreatedAt(),
                    i.getUser(),
                    likeCount,
                    commentCount,
                    likedByCurrentUser,
                    comments
            );
        }).toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{industry}")
    public ResponseEntity<List<StartUpIdea>> getStartupIdeasByIndustry(@PathVariable String industry) {
        List<StartUpIdea> ideas = interactionService.getStartupIdeasByIndustry(industry);
        return ResponseEntity.ok(ideas);
    }
}
