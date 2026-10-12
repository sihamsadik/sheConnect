package com.platform.SheConnect.dto;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class InvestorPipelineResponse {
    private List<DealPipelineItemDto> allDeals;
    private Map<String, List<DealPipelineItemDto>> dealsByStage;
    private Long activeInboundDeals;
    private Long inActiveDiligence;
    private Long partnerMeetings;
    private Long termSheetCount;
    private Long totalShortlisted;
    private List<Map<String, Object>> recentActivity;

    public InvestorPipelineResponse() {
        this.dealsByStage = new HashMap<>();
    }

    public InvestorPipelineResponse(
            List<DealPipelineItemDto> allDeals,
            Map<String, List<DealPipelineItemDto>> dealsByStage,
            Long activeInboundDeals,
            Long inActiveDiligence,
            Long partnerMeetings,
            Long termSheetCount,
            Long totalShortlisted,
            List<Map<String, Object>> recentActivity
    ) {
        this.allDeals = allDeals;
        this.dealsByStage = dealsByStage;
        this.activeInboundDeals = activeInboundDeals;
        this.inActiveDiligence = inActiveDiligence;
        this.partnerMeetings = partnerMeetings;
        this.termSheetCount = termSheetCount;
        this.totalShortlisted = totalShortlisted;
        this.recentActivity = recentActivity;
    }

    public List<DealPipelineItemDto> getAllDeals() {
        return allDeals;
    }

    public void setAllDeals(List<DealPipelineItemDto> allDeals) {
        this.allDeals = allDeals;
    }

    public Map<String, List<DealPipelineItemDto>> getDealsByStage() {
        return dealsByStage;
    }

    public void setDealsByStage(Map<String, List<DealPipelineItemDto>> dealsByStage) {
        this.dealsByStage = dealsByStage;
    }

    public Long getActiveInboundDeals() {
        return activeInboundDeals;
    }

    public void setActiveInboundDeals(Long activeInboundDeals) {
        this.activeInboundDeals = activeInboundDeals;
    }

    public Long getInActiveDiligence() {
        return inActiveDiligence;
    }

    public void setInActiveDiligence(Long inActiveDiligence) {
        this.inActiveDiligence = inActiveDiligence;
    }

    public Long getPartnerMeetings() {
        return partnerMeetings;
    }

    public void setPartnerMeetings(Long partnerMeetings) {
        this.partnerMeetings = partnerMeetings;
    }

    public Long getTermSheetCount() {
        return termSheetCount;
    }

    public void setTermSheetCount(Long termSheetCount) {
        this.termSheetCount = termSheetCount;
    }

    public Long getTotalShortlisted() {
        return totalShortlisted;
    }

    public void setTotalShortlisted(Long totalShortlisted) {
        this.totalShortlisted = totalShortlisted;
    }

    public List<Map<String, Object>> getRecentActivity() {
        return recentActivity;
    }

    public void setRecentActivity(List<Map<String, Object>> recentActivity) {
        this.recentActivity = recentActivity;
    }
}
