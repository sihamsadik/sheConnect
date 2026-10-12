package com.platform.SheConnect.dto;

import jakarta.validation.constraints.NotBlank;

public class UpdateDealStageRequest {
    @NotBlank(message = "Stage is required")
    private String stage;
    private String notes;

    public UpdateDealStageRequest() {}

    public UpdateDealStageRequest(String stage, String notes) {
        this.stage = stage;
        this.notes = notes;
    }

    public String getStage() {
        return stage;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
