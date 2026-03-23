package com.platform.SheConnect.controller;

import java.net.Authenticator;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.parameters.P;
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

@RestController
@RequestMapping("/api/interactions")
public class InteractionController {
    private final InteractionService interactionService;

    public InteractionController(InteractionService interactionService) {
        this.interactionService = interactionService;
    }
    @PostMapping("startup-ideas/{id}/comment")
    public ResponseEntity<String> commentOnStartupIdea(Authentication authentication,@PathVariable Long id,@RequestBody CommentRequestDto commentRequest){
        User user = (User) authentication.getPrincipal();
        String content = commentRequest.getContent();

        
        if (content != null) {
            try {
                Comment comment = interactionService.addCommentToStartupIdea(id, user.getId(), content);
                return ResponseEntity.ok("Comment added successfully");
            } catch (Exception e) {
                // TODO: handle exception
                return ResponseEntity.badRequest().body("Failed to add comment: " + e.getMessage());
            }
        }
        return ResponseEntity.badRequest().body("Failed to add comment");
    }
    @PostMapping("startup-ideas/{id}/like")
    public ResponseEntity<LikeResponse> likeStartupIdea(Authentication authentication,@PathVariable Long id,@RequestBody LikeRequest likeRequest) {
       User user = (User) authentication.getPrincipal();
      
       if (interactionService.hasUserLikedStartupIdea(id, user.getId())) {
           interactionService.unlikeStartupIdea(id, user.getId());
           return ResponseEntity.ok().body(new LikeResponse(interactionService.countLikesByStartupIdeaId(id), false));
       } else {
           interactionService.likeStartupIdea(id, user.getId());
           return ResponseEntity.ok().body(new LikeResponse(interactionService.countLikesByStartupIdeaId(id), true));
       }
    }
}