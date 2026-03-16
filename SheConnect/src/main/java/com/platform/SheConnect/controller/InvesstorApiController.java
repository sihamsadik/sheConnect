package com.platform.SheConnect.controller;

import java.util.List;

import org.hibernate.sql.exec.spi.PostAction;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.platform.SheConnect.dto.StartUpIdeaResponse;
import com.platform.SheConnect.entity.StartUpIdea;
import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.service.InvestorDashboardService;
@RestController
@RequestMapping("/api/investor")

public class InvesstorApiController {
    InvestorDashboardService investorDashboardService;


     public InvesstorApiController(InvestorDashboardService investorDashboardService) {
        this.investorDashboardService = investorDashboardService;
    }
    // investor Dash board 
    // as issue that the schema of the the user data base when different role 
    // see start up
    @GetMapping("/startup_ideas")
    public ResponseEntity<List<StartUpIdeaResponse>> getAllStartUpIdea(Authentication authentication){
        User user = (User) authentication.getPrincipal();
        List<StartUpIdea>  idea = investorDashboardService.getAllStartUpIdea();
        List<StartUpIdeaResponse> response = idea.stream().map(i -> new StartUpIdeaResponse(
            i.getId(),
            i.getUser(),
            i.getTitle(),
            i.getIndustry().getName(),
            i.getLookingFor().stream().map(n -> n.getName()).sorted().toList(),
            user
        )).toList();

        return ResponseEntity.ok(response);
    }
    @GetMapping("/dashboard")
//     public ResponseEntity<List<StartUpIdeaResponse>> getDashboard(Authentication authentication){
    
    
// }
}
