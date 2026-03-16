package com.platform.SheConnect.dto;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.List;

import com.platform.SheConnect.entity.User;

public class StartUpIdeaResponse {
    private Long id;
    private String title;
    private String industry;
    private List<String> lookingFor;
    private User ideaAdmin;
    private User user;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


    public StartUpIdeaResponse(Long id,User ideaAdmin, String title, String industry, List<String> lookingFor,LocalDateTime updatedAt,LocalDateTime createdAt,User user) {
        this.id = id;
        this.title = title;
        this.industry = industry;
        this.lookingFor = lookingFor;
        this.ideaAdmin = ideaAdmin;
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
        this.user =user;
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
    public User getUser(){
        return user;
    }
    public User getIdeaAdmin(){
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
