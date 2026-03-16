package com.platform.SheConnect.dto;

import java.util.List;

import com.platform.SheConnect.entity.User;

public class DashboardResponse {
    private long ideaCount;
    private int totalLikes;
    private long totalComments;
    private double engagementRate;
    private List<StartUpIdeaSummary> ideas;
    private User user;

    public DashboardResponse(long ideaCount,User user, int totalLikes, long totalComments, double engagementRate,
            List<StartUpIdeaSummary> ideas) {
        this.ideaCount = ideaCount;
        this.totalLikes = totalLikes;
        this.totalComments = totalComments;
        this.engagementRate = engagementRate;
        this.ideas = ideas;
        this.user =user;
    }

    public long getIdeaCount() {
        return ideaCount;
    }
    public User getUser(){
        return user;
    }
    public int getTotalLikes() {
        return totalLikes;
    }

    public long getTotalComments() {
        return totalComments;
    }

    public double getEngagementRate() {
        return engagementRate;
    }

    public List<StartUpIdeaSummary> getIdeas() {
        return ideas;
    }
}
