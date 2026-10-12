package com.platform.SheConnect.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.platform.SheConnect.dto.AdminDashboardResponse;
import com.platform.SheConnect.dto.AdminDashboardResponse.AdminIdeaDto;
import com.platform.SheConnect.dto.AdminDashboardResponse.AdminUserDto;
import com.platform.SheConnect.entity.Industry;
import com.platform.SheConnect.service.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboardOverview());
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDto>> getUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(adminService.getUsers(role, search));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<AdminUserDto> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body
    ) {
        String newRole = body.get("role");
        if (newRole == null || newRole.trim().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(adminService.updateUserRole(id, newRole));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/ideas")
    public ResponseEntity<List<AdminIdeaDto>> getIdeas(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String industry
    ) {
        return ResponseEntity.ok(adminService.getIdeas(search, industry));
    }

    @DeleteMapping("/ideas/{id}")
    public ResponseEntity<Void> deleteIdea(@PathVariable Long id) {
        adminService.deleteIdea(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/industries")
    public ResponseEntity<Industry> addIndustry(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        if (name == null || name.trim().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.addIndustry(name));
    }

    @DeleteMapping("/industries/{id}")
    public ResponseEntity<Void> deleteIndustry(@PathVariable Long id) {
        adminService.deleteIndustry(id);
        return ResponseEntity.noContent().build();
    }
}
