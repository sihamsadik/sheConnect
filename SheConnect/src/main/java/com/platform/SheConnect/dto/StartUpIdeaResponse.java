package com.platform.SheConnect.dto;

import java.util.List;

import com.platform.SheConnect.entity.User;

public class StartUpIdeaResponse {
    private Long id;
    private String title;
    private String industry;
    private List<String> lookingFor;
    private User user;

    public StartUpIdeaResponse(Long id,User user, String title, String industry, List<String> lookingFor) {
        this.id = id;
        this.title = title;
        this.industry = industry;
        this.lookingFor = lookingFor;
        this.user = user;
    }

    public Long getId() {
        return id;
    }
    public User getUser(){
        return user;
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
