package com.platform.SheConnect.controller;

import java.net.Authenticator;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.platform.SheConnect.dto.LikeRequest;
import com.platform.SheConnect.dto.LikeResponse;
import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.service.InteractionService;

@RestController
@RequestMapping("/api/interactions")
public class InteractionController {
    private final InteractionService interactionService;

    public InteractionController(InteractionService interactionService) {
        this.interactionService = interactionService;
    }
    @PostMapping("/like")
    public ResponseEntity<LikeResponse> likeStartupIdea(Authentication authentication,@RequestBody LikeRequest likeRequest) {
       User user = (User) authentication.getPrincipal();
       if (interactionService.hasUserLikedStartupIdea(likeRequest.getStartupIdeaId(), user.getId())) {
           interactionService.unlikeStartupIdea(likeRequest.getStartupIdeaId(), user.getId());
           return ResponseEntity.ok().body(new LikeResponse(interactionService.countLikesByStartupIdeaId(likeRequest.getStartupIdeaId()), false));
       } else {
           interactionService.likeStartupIdea(likeRequest.getStartupIdeaId(), user.getId());
           return ResponseEntity.ok().body(new LikeResponse(interactionService.countLikesByStartupIdeaId(likeRequest.getStartupIdeaId()), true));
       }
    }
}