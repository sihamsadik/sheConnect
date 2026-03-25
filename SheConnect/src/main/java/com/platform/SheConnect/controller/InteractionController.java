package com.platform.SheConnect.controller;

import java.net.Authenticator;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.platform.SheConnect.dto.CommentRequestDto;
import com.platform.SheConnect.dto.LikeRequest;
import com.platform.SheConnect.dto.LikeResponse;
import com.platform.SheConnect.entity.Comment;
import com.platform.SheConnect.entity.StartUpIdea;
import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.service.InteractionService;

import jakarta.annotation.Generated;

@RestController
@RequestMapping("/api/interactions")
public class InteractionController {
    private static final Logger log = LoggerFactory.getLogger(InteractionController.class);
    private final InteractionService interactionService;

    public InteractionController(InteractionService interactionService) {
        this.interactionService = interactionService;
    }
    @PostMapping("startup-ideas/{id}/comment")
    public ResponseEntity<?> commentOnStartupIdea(Authentication authentication,@PathVariable Long id,@RequestBody CommentRequestDto commentRequest){
        User user = (User) authentication.getPrincipal();
        String content = commentRequest.getContent();

        
        if (content != null && !content.isBlank()) {
            try {
                Comment comment = interactionService.addCommentToStartupIdea(id, user.getId(), content);
                return ResponseEntity.ok(
                        Map.of(
                                "commentId", comment.getId(),
                                "content", comment.getContent(),
                                "userId", comment.getUser().getName(),
                                "startupIdeaId", comment.getStartupIdea().getId()));
            } catch (Exception e) {
                log.error("Failed to add comment (startupIdeaId={}, userId={})", id, user.getId(), e);
                return ResponseEntity.badRequest().body(Map.of("error", "Failed to add comment"));
            }
        }
        return ResponseEntity.badRequest().body("Failed to add comment");
    }
    
    
    @GetMapping("startup-ideas/{id}/like")
    public ResponseEntity<LikeResponse> likeStartupIdea(Authentication authentication,@PathVariable Long id) {
       User user = (User) authentication.getPrincipal();
      
       if (interactionService.hasUserLikedStartupIdea(id, user.getId())) {
           interactionService.unlikeStartupIdea(id, user.getId());
           return ResponseEntity.ok().body(new LikeResponse(interactionService.countLikesByStartupIdeaId(id), false));
       } else {
           interactionService.likeStartupIdea(id, user.getId());
           return ResponseEntity.ok().body(new LikeResponse(interactionService.countLikesByStartupIdeaId(id), true));
       }
    }
    @GetMapping("/{industry}")
    public ResponseEntity<List<StartUpIdea>> getStartupIdeasByIndustry(@PathVariable String industry) {
        List<StartUpIdea> ideas = interactionService.getStartupIdeasByIndustry(industry);
        return ResponseEntity.ok(ideas);
    }

}
