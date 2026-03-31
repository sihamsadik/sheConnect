package com.platform.SheConnect.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class CreateStartUpIdeaRequest {
    @NotBlank(message = "Title is required")
    private String title;

    private String problem;
    private String solution;

    private String targetMarket;
    @NotBlank(message = "Industry is required")
    private String industryName;
    @NotEmpty(message = "Looking for is required")
private List<@Pattern(regexp = "^(INVESTOR|ADVISOR|BOTH)$", 
         message = "Each need must be INVESTOR, ADVISOR, or BOTH") String> lookingFor;
    @NotBlank(message = "Description can not be blank")
    private String description;
    // private String userEmail;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
    // public String getUserEmail() {
    //     return userEmail;
    // }
    // public void setUserEmail(String userEmail) {
    //     this.userEmail = userEmail;
    // }

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

    public String getIndustryName() {
        return industryName;
    }

    public void setIndustryName(String industryName) {
        this.industryName = industryName;
    }

    public List<String> getLookingFor() {
        return lookingFor;
    }

    public void setLookingFor(List<String> lookingFor) {
        this.lookingFor = lookingFor;
    }
}
