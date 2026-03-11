package com.platform.SheConnect.dto;

import java.util.List;

public class DashboardResponse {
    private long ideaCount;
    private int totalLikes;
    private long totalComments;
    private double engagementRate;
    private List<StartUpIdeaSummary> ideas;

    public DashboardResponse(long ideaCount, int totalLikes, long totalComments, double engagementRate,
            List<StartUpIdeaSummary> ideas) {
        this.ideaCount = ideaCount;
        this.totalLikes = totalLikes;
        this.totalComments = totalComments;
        this.engagementRate = engagementRate;
        this.ideas = ideas;
    }

    public long getIdeaCount() {
        return ideaCount;
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
