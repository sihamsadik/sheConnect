package com.platform.SheConnect.dto;

public class StartUpIdeaSummary {
    private Long id;
    private String title;
    private String industry;
    private int likes;

    public StartUpIdeaSummary(Long id, String title, String industry, int likes) {
        this.id = id;
        this.title = title;
        this.industry = industry;
        this.likes = likes;
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

    public int getLikes() {
        return likes;
    }
}
