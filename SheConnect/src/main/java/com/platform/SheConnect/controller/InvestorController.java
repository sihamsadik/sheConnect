package com.platform.SheConnect.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.service.InvestorDashboardService;

@RestController
@RequestMapping("/api/investor")
public class InvestorController {

    private final InvestorDashboardService investorDashboardService;

    public InvestorController(InvestorDashboardService investorDashboardService) {
        this.investorDashboardService = investorDashboardService;
    }
    @GetMapping("/dashboard")
    public ResponseEntity<InvestorDashboardResponse> getDashboardData(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        // Call the service methods to get the required data
        long ideaCount = investorDashboardService.getIdeaCount(user.getId());
        long totalLikes = investorDashboardService.getTotalLikes(user.getId());
        long totalComments = investorDashboardService.getTotalComments(user.getId());

        // Create and return the response object
        InvestorDashboardResponse response = new InvestorDashboardResponse(ideaCount, totalLikes, totalComments);
        return ResponseEntity.ok(response);
    }

}
