package com.platform.SheConnect.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.platform.SheConnect.dto.AdvisorDashboardResponse;
import com.platform.SheConnect.dto.AdvisorProfileResponse;
import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.exception.ResourceNotFoundException;
import com.platform.SheConnect.repository.UserRepository;
import com.platform.SheConnect.service.AdvisorService;

@RestController
@RequestMapping("/api/advisor")
public class AdvisorController {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AdvisorController.class);

    private final AdvisorService advisorService;
    private final UserRepository userRepository;

    public AdvisorController(AdvisorService advisorService, UserRepository userRepository) {
        this.advisorService = advisorService;
        this.userRepository = userRepository;
    }

    // ------------------------------------------------------------------
    // Resolve authenticated user
    // ------------------------------------------------------------------

    private User resolveUser(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) return null;
        Object principal = authentication.getPrincipal();
        if (principal instanceof User user) {
            if (user.getId() != null) return user;
            if (user.getEmail() != null) return userRepository.findByEmail(user.getEmail()).orElse(user);
            return user;
        } else if (principal instanceof org.springframework.security.core.userdetails.UserDetails ud) {
            return userRepository.findByEmail(ud.getUsername()).orElse(null);
        } else if (principal instanceof String str && !str.equalsIgnoreCase("anonymousUser")) {
            return userRepository.findByEmail(str).orElse(null);
        }
        return null;
    }

    // ------------------------------------------------------------------
    // GET /api/advisor/profile/me
    // ------------------------------------------------------------------

    @GetMapping("/profile/me")
    public ResponseEntity<AdvisorProfileResponse> getMyProfile(Authentication authentication) {
        User advisor = resolveUser(authentication);
        if (advisor == null || advisor.getId() == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(advisorService.getProfile(advisor, advisor));
    }

    // ------------------------------------------------------------------
    // GET /api/advisor/profile/{id}
    // ------------------------------------------------------------------

    @GetMapping("/profile/{id}")
    public ResponseEntity<AdvisorProfileResponse> getProfile(
            @PathVariable Long id,
            Authentication authentication) {
        User advisor = userRepository.findById(id).orElse(null);
        if (advisor == null) return ResponseEntity.notFound().build();
        User currentUser = resolveUser(authentication);
        return ResponseEntity.ok(advisorService.getProfile(advisor, currentUser));
    }

    // ------------------------------------------------------------------
    // GET /api/advisor/dashboard
    // ------------------------------------------------------------------

    @GetMapping("/dashboard")
    public ResponseEntity<AdvisorDashboardResponse> getDashboard(Authentication authentication) {
        User advisor = resolveUser(authentication);
        if (advisor == null || advisor.getId() == null) {
            return ResponseEntity.status(401).build();
        }
        AdvisorDashboardResponse response = advisorService.getDashboard(advisor);
        return ResponseEntity.ok(response);
    }

    // ------------------------------------------------------------------
    // POST /api/advisor/requests/{id}/accept
    // ------------------------------------------------------------------

    @PostMapping("/requests/{id}/accept")
    public ResponseEntity<Map<String, String>> acceptRequest(
            @PathVariable Long id,
            Authentication authentication) {
        User advisor = resolveUser(authentication);
        if (advisor == null || advisor.getId() == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            advisorService.acceptRequest(id, advisor);
            return ResponseEntity.ok(Map.of("message", "Request accepted successfully"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        }
    }

    // ------------------------------------------------------------------
    // POST /api/advisor/requests/{id}/decline
    // ------------------------------------------------------------------

    @PostMapping("/requests/{id}/decline")
    public ResponseEntity<Map<String, String>> declineRequest(
            @PathVariable Long id,
            Authentication authentication) {
        User advisor = resolveUser(authentication);
        if (advisor == null || advisor.getId() == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            advisorService.declineRequest(id, advisor);
            return ResponseEntity.ok(Map.of("message", "Request declined"));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
        }
    }
}
