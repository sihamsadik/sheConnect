package com.platform.SheConnect.dto;

import java.time.LocalDateTime;

public class DealPipelineItemDto {
    private Long id;
    private Long pipelineId;
    private String startup;
    private String logo;
    private String pitch;
    private String problem;
    private String solution;
    private String targetMarket;
    private String industry;
    private String stage;
    private String stageClass;
    private String ask;
    private String founderName;
    private String founderEmail;
    private String founderInitials;
    private Long likeCount;
    private Long commentCount;
    private Boolean likedByCurrentUser;
    private Boolean interested;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public DealPipelineItemDto() {}

    public DealPipelineItemDto(
            Long id,
            Long pipelineId,
            String startup,
            String logo,
            String pitch,
            String problem,
            String solution,
            String targetMarket,
            String industry,
            String stage,
            String stageClass,
            String ask,
            String founderName,
            String founderEmail,
            String founderInitials,
            Long likeCount,
            Long commentCount,
            Boolean likedByCurrentUser,
            Boolean interested,
            String notes,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        this.id = id;
        this.pipelineId = pipelineId;
        this.startup = startup;
        this.logo = logo;
        this.pitch = pitch;
        this.problem = problem;
        this.solution = solution;
        this.targetMarket = targetMarket;
        this.industry = industry;
        this.stage = stage;
        this.stageClass = stageClass;
        this.ask = ask;
        this.founderName = founderName;
        this.founderEmail = founderEmail;
        this.founderInitials = founderInitials;
        this.likeCount = likeCount;
        this.commentCount = commentCount;
        this.likedByCurrentUser = likedByCurrentUser;
        this.interested = interested;
        this.notes = notes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPipelineId() {
        return pipelineId;
    }

    public void setPipelineId(Long pipelineId) {
        this.pipelineId = pipelineId;
    }

    public String getStartup() {
        return startup;
    }

    public void setStartup(String startup) {
        this.startup = startup;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getPitch() {
        return pitch;
    }

    public void setPitch(String pitch) {
        this.pitch = pitch;
    }

    public String getProblem() {
        return problem;
    }

    public void setProblem(String problem) {
        this.problem = problem;
    }

    public String getSolution() {
        return solution;
    }

    public void setSolution(String solution) {
        this.solution = solution;
    }

    public String getTargetMarket() {
        return targetMarket;
    }

    public void setTargetMarket(String targetMarket) {
        this.targetMarket = targetMarket;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getStage() {
        return stage;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }

    public String getStageClass() {
        return stageClass;
    }

    public void setStageClass(String stageClass) {
        this.stageClass = stageClass;
    }

    public String getAsk() {
        return ask;
    }

    public void setAsk(String ask) {
        this.ask = ask;
    }

    public String getFounderName() {
        return founderName;
    }

    public void setFounderName(String founderName) {
        this.founderName = founderName;
    }

    public String getFounderEmail() {
        return founderEmail;
    }

    public void setFounderEmail(String founderEmail) {
        this.founderEmail = founderEmail;
    }

    public String getFounderInitials() {
        return founderInitials;
    }

    public void setFounderInitials(String founderInitials) {
        this.founderInitials = founderInitials;
    }

    public Long getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(Long likeCount) {
        this.likeCount = likeCount;
    }

    public Long getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(Long commentCount) {
        this.commentCount = commentCount;
    }

    public Boolean getLikedByCurrentUser() {
        return likedByCurrentUser;
    }

    public void setLikedByCurrentUser(Boolean likedByCurrentUser) {
        this.likedByCurrentUser = likedByCurrentUser;
    }

    public Boolean getInterested() {
        return interested;
    }

    public void setInterested(Boolean interested) {
        this.interested = interested;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
