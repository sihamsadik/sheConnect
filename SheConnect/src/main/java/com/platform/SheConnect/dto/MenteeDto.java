package com.platform.SheConnect.dto;

public class MenteeDto {

    private Long mentorshipId;
    private Long menteeId;
    private String menteeName;
    private String menteeInitials;
    private String menteeEmail;
    private String startupName;
    private String startupIndustry;
    private String status;
    private String mentorshipType;
    private String sprintGoal;
    private String requestMessage;
    private String createdAt;
    private String updatedAt;

    public Long getMentorshipId() { return mentorshipId; }
    public void setMentorshipId(Long mentorshipId) { this.mentorshipId = mentorshipId; }

    public Long getMenteeId() { return menteeId; }
    public void setMenteeId(Long menteeId) { this.menteeId = menteeId; }

    public String getMenteeName() { return menteeName; }
    public void setMenteeName(String menteeName) { this.menteeName = menteeName; }

    public String getMenteeInitials() { return menteeInitials; }
    public void setMenteeInitials(String menteeInitials) { this.menteeInitials = menteeInitials; }

    public String getMenteeEmail() { return menteeEmail; }
    public void setMenteeEmail(String menteeEmail) { this.menteeEmail = menteeEmail; }

    public String getStartupName() { return startupName; }
    public void setStartupName(String startupName) { this.startupName = startupName; }

    public String getStartupIndustry() { return startupIndustry; }
    public void setStartupIndustry(String startupIndustry) { this.startupIndustry = startupIndustry; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMentorshipType() { return mentorshipType; }
    public void setMentorshipType(String mentorshipType) { this.mentorshipType = mentorshipType; }

    public String getSprintGoal() { return sprintGoal; }
    public void setSprintGoal(String sprintGoal) { this.sprintGoal = sprintGoal; }

    public String getRequestMessage() { return requestMessage; }
    public void setRequestMessage(String requestMessage) { this.requestMessage = requestMessage; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}
