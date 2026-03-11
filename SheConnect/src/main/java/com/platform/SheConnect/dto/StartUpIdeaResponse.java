package com.platform.SheConnect.dto;

import java.util.List;

public class StartUpIdeaResponse {
    private Long id;
    private String title;
    private String industry;
    private List<String> lookingFor;

    public StartUpIdeaResponse(Long id, String title, String industry, List<String> lookingFor) {
        this.id = id;
        this.title = title;
        this.industry = industry;
        this.lookingFor = lookingFor;
    }

    public Long getId() {
        return id;
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
