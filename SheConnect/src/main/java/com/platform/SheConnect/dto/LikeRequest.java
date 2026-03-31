package com.platform.SheConnect.dto;

import jakarta.validation.constraints.NotBlank;

public class LikeRequest {
    @NotBlank(message = "")
    private Long startupIdeaId;
    

    public Long getStartupIdeaId() {
        return startupIdeaId;
    }

    public void setStartupIdeaId(Long startupIdeaId) {
        this.startupIdeaId = startupIdeaId;
    }

   
    
}
