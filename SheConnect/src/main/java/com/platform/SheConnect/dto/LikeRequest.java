package com.platform.SheConnect.dto;

public class LikeRequest {
    private Long startupIdeaId;
    private Long userId;

    public Long getStartupIdeaId() {
        return startupIdeaId;
    }

    public void setStartupIdeaId(Long startupIdeaId) {
        this.startupIdeaId = startupIdeaId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
