package com.platform.SheConnect.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.platform.SheConnect.dto.DealPipelineItemDto;
import com.platform.SheConnect.dto.InvestorDashboardResponse;
import com.platform.SheConnect.dto.InvestorPipelineResponse;
import com.platform.SheConnect.dto.UpdateDealStageRequest;
import com.platform.SheConnect.entity.StartUpIdea;
import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.exception.ResourceNotFoundException;
import com.platform.SheConnect.repository.UserRepository;
import com.platform.SheConnect.service.InvestorDashboardService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/investor")
public class InvestorController {
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(InvestorController.class);

    private final InvestorDashboardService investorDashboardService;
    private final UserRepository userRepository;

    public InvestorController(InvestorDashboardService investorDashboardService, UserRepository userRepository) {
        this.investorDashboardService = investorDashboardService;
        this.userRepository = userRepository;
    }

    private User resolveUser(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            return null;
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof User user) {
            if (user.getId() != null) {
                return user;
            }
            if (user.getEmail() != null) {
                return userRepository.findByEmail(user.getEmail()).orElse(user);
            }
            return user;
        } else if (principal instanceof org.springframework.security.core.userdetails.UserDetails userDetails) {
            return userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        } else if (principal instanceof String str && !str.equalsIgnoreCase("anonymousUser")) {
            return userRepository.findByEmail(str).orElse(null);
        }
        return null;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<InvestorDashboardResponse> getDashboardData(Authentication authentication) {
        User user = resolveUser(authentication);
        if (user == null || user.getId() == null) {
            throw new ResourceNotFoundException("User not found");
        }
        Long interestedIdeaCount = investorDashboardService.getInvestorInterestCount(user.getId());
        List<StartUpIdea> needIdeas = investorDashboardService.getIdeasByEntrepreneurNeed(user.getRole() != null ? user.getRole().getName() : "INVESTOR");
        Long totalLikes = investorDashboardService.getTotalLikes(user.getId());
        Long totalComments = investorDashboardService.getTotalComments(user.getId());

        InvestorDashboardResponse response = new InvestorDashboardResponse(needIdeas, interestedIdeaCount, totalLikes, totalComments);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/pipeline")
    public ResponseEntity<InvestorPipelineResponse> getPipeline(Authentication authentication) {
        try {
            User user = resolveUser(authentication);
            Long userId = (user != null) ? user.getId() : null;
            InvestorPipelineResponse response = investorDashboardService.getInvestorPipeline(userId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error retrieving investor pipeline: ", e);
            return ResponseEntity.ok(new InvestorPipelineResponse(
                    List.of(),
                    Map.of("screening", List.of(), "diligence", List.of(), "partnerMeeting", List.of(), "termSheet", List.of()),
                    0L, 0L, 0L, 0L, 0L,
                    List.of()
            ));
        }
    }

    @PutMapping("/pipeline/{ideaId}/stage")
    public ResponseEntity<DealPipelineItemDto> updateDealStage(
            Authentication authentication,
            @PathVariable Long ideaId,
            @Valid @RequestBody UpdateDealStageRequest request
    ) {
        User user = resolveUser(authentication);
        if (user == null || user.getId() == null) {
            throw new ResourceNotFoundException("User not found");
        }
        DealPipelineItemDto updated = investorDashboardService.updateDealStage(
                user.getId(),
                ideaId,
                request.getStage(),
                request.getNotes()
        );
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/pipeline/{ideaId}")
    public ResponseEntity<Void> passDeal(Authentication authentication, @PathVariable Long ideaId) {
        User user = resolveUser(authentication);
        if (user == null || user.getId() == null) {
            throw new ResourceNotFoundException("User not found");
        }
        investorDashboardService.passDeal(user.getId(), ideaId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/pipeline/{ideaId}/interest")
    public ResponseEntity<Map<String, Object>> toggleInterest(
            Authentication authentication,
            @PathVariable Long ideaId
    ) {
        User user = resolveUser(authentication);
        if (user == null || user.getId() == null) {
            throw new ResourceNotFoundException("User not found");
        }
        boolean interested = investorDashboardService.toggleInterest(user.getId(), ideaId);
        Map<String, Object> resp = new HashMap<>();
        resp.put("ideaId", ideaId);
        resp.put("interested", interested);
        return ResponseEntity.ok(resp);
    }
}
