package com.platform.SheConnect.dto;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;

import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.dto.LoginResponse;


public class StartUpIdeaResponse {
    private Long id;
    private String title;
    private String industry;
    private List<String> lookingFor;
    private LoginResponse ideaAdmin;
    private LoginResponse user;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    public StartUpIdeaResponse(Long id,User ideaAdmin, String title, String industry, List<String> lookingFor,LocalDateTime updatedAt,LocalDateTime createdAt,User user) {
        this.id = id;
        this.title = title;
        this.industry = industry;
        this.lookingFor = lookingFor;
        this.ideaAdmin = mapToLoginResponse(ideaAdmin);
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
        this.user = mapToLoginResponse(user);
    }
    public LoginResponse mapToLoginResponse(User user) {
        if (user == null) {
            return null;
        }
        return new LoginResponse(user.getName(), user.getEmail(), user.getRole().getName(), null, null);
    }
    public LocalDateTime getCreatedAt(){
        return createdAt;
    }
    public LocalDateTime getUpdatedAt(){
        return updatedAt;
    }

    public Long getId() {
        return id;
    }
    public LoginResponse getUser(){
        return user;
    }
    public LoginResponse getIdeaAdmin(){
        return ideaAdmin;
    }

    public String getTitle() {
        return title;
    }

    public String getIndustry() {
        return industry;
    }

    public List<String> getLookingFor() {
        return lookingFor;
    }
}
