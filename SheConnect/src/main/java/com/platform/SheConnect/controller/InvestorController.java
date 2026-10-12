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

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(Authentication authentication) {
        User user = resolveUser(authentication);
        if (user == null || user.getId() == null) {
            throw new ResourceNotFoundException("User not found");
        }
        User fullUser = userRepository.findById(user.getId()).orElse(user);

        long interestedCount = investorDashboardService.getInvestorInterestCount(fullUser.getId());
        InvestorPipelineResponse pipeline = investorDashboardService.getInvestorPipeline(fullUser.getId());

        Map<String, Object> resp = new HashMap<>();
        resp.put("id", fullUser.getId());
        resp.put("name", fullUser.getName() != null ? fullUser.getName() : "Investor");
        resp.put("email", fullUser.getEmail());
        resp.put("role", fullUser.getRole() != null ? fullUser.getRole().getName() : "INVESTOR");
        resp.put("title", fullUser.getTitle() != null ? fullUser.getTitle() : "");
        resp.put("location", fullUser.getLocation() != null ? fullUser.getLocation() : "");
        resp.put("bio", fullUser.getBio() != null ? fullUser.getBio() : "");
        resp.put("checkSize", fullUser.getCheckSize() != null ? fullUser.getCheckSize() : "");
        resp.put("investmentThesis", fullUser.getInvestmentThesis() != null ? fullUser.getInvestmentThesis() : "");
        resp.put("focusIndustries", fullUser.getFocusIndustries() != null ? fullUser.getFocusIndustries() : "");
        resp.put("totalInvestments", interestedCount);
        resp.put("inDiligence", pipeline != null ? pipeline.getInActiveDiligence() : 0L);
        resp.put("partnerMeetings", pipeline != null ? pipeline.getPartnerMeetings() : 0L);
        resp.put("termSheets", pipeline != null ? pipeline.getTermSheetCount() : 0L);
        resp.put("portfolioDeals", pipeline != null ? pipeline.getAllDeals() : List.of());

        return ResponseEntity.ok(resp);
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, Object>> updateProfile(
            Authentication authentication,
            @RequestBody Map<String, String> updates
    ) {
        User user = resolveUser(authentication);
        if (user == null || user.getId() == null) {
            throw new ResourceNotFoundException("User not found");
        }
        User fullUser = userRepository.findById(user.getId()).orElse(user);

        if (updates.containsKey("name") && updates.get("name") != null && !updates.get("name").trim().isBlank()) {
            fullUser.setName(updates.get("name").trim());
        }
        if (updates.containsKey("title")) {
            fullUser.setTitle(updates.get("title") != null ? updates.get("title").trim() : "");
        }
        if (updates.containsKey("location")) {
            fullUser.setLocation(updates.get("location") != null ? updates.get("location").trim() : "");
        }
        if (updates.containsKey("bio")) {
            fullUser.setBio(updates.get("bio") != null ? updates.get("bio").trim() : "");
        }
        if (updates.containsKey("checkSize")) {
            fullUser.setCheckSize(updates.get("checkSize") != null ? updates.get("checkSize").trim() : "");
        }
        if (updates.containsKey("investmentThesis")) {
            fullUser.setInvestmentThesis(updates.get("investmentThesis") != null ? updates.get("investmentThesis").trim() : "");
        }
        if (updates.containsKey("focusIndustries")) {
            fullUser.setFocusIndustries(updates.get("focusIndustries") != null ? updates.get("focusIndustries").trim() : "");
        }

        userRepository.save(fullUser);

        return getProfile(authentication);
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<Map<String, Object>> getProfileById(@PathVariable Long id) {
        User fullUser = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Investor not found"));
        long interestedCount = investorDashboardService.getInvestorInterestCount(fullUser.getId());
        InvestorPipelineResponse pipeline = investorDashboardService.getInvestorPipeline(fullUser.getId());

        Map<String, Object> resp = new HashMap<>();
        resp.put("id", fullUser.getId());
        resp.put("name", fullUser.getName() != null ? fullUser.getName() : "Investor");
        resp.put("email", fullUser.getEmail());
        resp.put("role", fullUser.getRole() != null ? fullUser.getRole().getName() : "INVESTOR");
        resp.put("title", fullUser.getTitle() != null ? fullUser.getTitle() : "");
        resp.put("location", fullUser.getLocation() != null ? fullUser.getLocation() : "");
        resp.put("bio", fullUser.getBio() != null ? fullUser.getBio() : "");
        resp.put("checkSize", fullUser.getCheckSize() != null ? fullUser.getCheckSize() : "");
        resp.put("investmentThesis", fullUser.getInvestmentThesis() != null ? fullUser.getInvestmentThesis() : "");
        resp.put("focusIndustries", fullUser.getFocusIndustries() != null ? fullUser.getFocusIndustries() : "");
        resp.put("totalInvestments", interestedCount);
        resp.put("inDiligence", pipeline != null ? pipeline.getInActiveDiligence() : 0L);
        resp.put("partnerMeetings", pipeline != null ? pipeline.getPartnerMeetings() : 0L);
        resp.put("termSheets", pipeline != null ? pipeline.getTermSheetCount() : 0L);
        resp.put("portfolioDeals", pipeline != null ? pipeline.getAllDeals() : List.of());
        return ResponseEntity.ok(resp);
    }
}
