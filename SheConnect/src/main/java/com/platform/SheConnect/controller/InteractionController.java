package com.platform.SheConnect.controller;

import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.platform.SheConnect.dto.LikeRequest;
import com.platform.SheConnect.service.InteractionService;

@RestController
@RequestMapping("/api/interactions")
public class InteractionController {
    private final InteractionService interactionService;

    public InteractionController(InteractionService interactionService) {
        this.interactionService = interactionService;
    }
    @PostMapping("/like")
    public ResponseEntity<?> likeStartupIdea(@RequestBody LikeRequest likeRequest) {
        // Implement the like functionality using interactionService
       if (interactionService.hasUserLikedStartupIdea(likeRequest.getStartupIdeaId(), likeRequest.getUserId())) {

           interactionService.unlikeStartupIdea(likeRequest.getStartupIdeaId(), likeRequest.getUserId());
           return ResponseEntity.ok().body("Startup idea unliked successfully");
       } else {
           interactionService.likeStartupIdea(likeRequest.getStartupIdeaId(), likeRequest.getUserId());
           return ResponseEntity.ok().body("Startup idea liked successfully");
       }
    }
}