package com.platform.SheConnect.dto;

import java.util.List;

import com.platform.SheConnect.entity.StartUpIdea;

public class InvestorDashboardResponse {
    private List<StartUpIdea> needIdeas;
    private Long interestedIdeaCount;
    private Long totalLikes;
    private Long totalComments;

    public InvestorDashboardResponse(List<StartUpIdea> needIdeas, Long interestedIdeaCount, Long totalLikes, Long totalComments) {
        this.needIdeas = needIdeas;
        this.interestedIdeaCount = interestedIdeaCount;
        this.totalLikes = totalLikes;
        this.totalComments = totalComments;
    }

    public List<StartUpIdea> getNeedIdeas() {
        return needIdeas;
    }

    public void setNeedIdeas(List<StartUpIdea> needIdeas) {
        this.needIdeas = needIdeas;
    }

    public Long getInterestedIdeaCount() {
        return interestedIdeaCount;
    }

    public void setInterestedIdeaCount(Long interestedIdeaCount) {
        this.interestedIdeaCount = interestedIdeaCount;
    }

    public Long getTotalLikes() {
        return totalLikes;
    }

    public void setTotalLikes(Long totalLikes) {
        this.totalLikes = totalLikes;
    }

    public Long getTotalComments() {
        return totalComments;
    }

    public void setTotalComments(Long totalComments) {
        this.totalComments = totalComments;
    }
    
}
