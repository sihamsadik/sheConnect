package com.platform.SheConnect.dto;

import java.util.List;

public class AdvisorDashboardResponse {

    // ---- Stat Metrics ----
    private long activeMentees;
    private double advisoryHoursThisMonth;
    private long pendingRequests;
    private long upcomingSessionsCount;

    // ---- Advisor profile info ----
    private String advisorName;
    private String advisorTitle;
    private String advisorInitials;
    private boolean acceptingStartups;

    // ---- Lists ----
    private List<SessionDto> upcomingSessions;
    private List<MentorshipDto> activeMentorships;
    private List<PendingRequestDto> pendingRequestList;
    private List<ActivityDto> recentActivity;

    // ========== Nested DTOs ==========

    public static class SessionDto {
        private Long id;
        private String day;
        private String time;
        private String founder;
        private String startup;
        private String agenda;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getDay() { return day; }
        public void setDay(String day) { this.day = day; }
        public String getTime() { return time; }
        public void setTime(String time) { this.time = time; }
        public String getFounder() { return founder; }
        public void setFounder(String founder) { this.founder = founder; }
        public String getStartup() { return startup; }
        public void setStartup(String startup) { this.startup = startup; }
        public String getAgenda() { return agenda; }
        public void setAgenda(String agenda) { this.agenda = agenda; }
    }

    public static class MentorshipDto {
        private Long id;
        private String startup;
        private String logo;
        private String founder;
        private String status;
        private String statusClass;
        private String sprintGoal;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getStartup() { return startup; }
        public void setStartup(String startup) { this.startup = startup; }
        public String getLogo() { return logo; }
        public void setLogo(String logo) { this.logo = logo; }
        public String getFounder() { return founder; }
        public void setFounder(String founder) { this.founder = founder; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getStatusClass() { return statusClass; }
        public void setStatusClass(String statusClass) { this.statusClass = statusClass; }
        public String getSprintGoal() { return sprintGoal; }
        public void setSprintGoal(String sprintGoal) { this.sprintGoal = sprintGoal; }
    }

    public static class PendingRequestDto {
        private Long id;
        private String startup;
        private String founder;
        private String message;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getStartup() { return startup; }
        public void setStartup(String startup) { this.startup = startup; }
        public String getFounder() { return founder; }
        public void setFounder(String founder) { this.founder = founder; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class ActivityDto {
        private Long id;
        private String type;
        private String content;
        private String time;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getTime() { return time; }
        public void setTime(String time) { this.time = time; }
    }

    // ========== Root Getters & Setters ==========

    public long getActiveMentees() { return activeMentees; }
    public void setActiveMentees(long activeMentees) { this.activeMentees = activeMentees; }

    public double getAdvisoryHoursThisMonth() { return advisoryHoursThisMonth; }
    public void setAdvisoryHoursThisMonth(double advisoryHoursThisMonth) { this.advisoryHoursThisMonth = advisoryHoursThisMonth; }

    public long getPendingRequests() { return pendingRequests; }
    public void setPendingRequests(long pendingRequests) { this.pendingRequests = pendingRequests; }

    public long getUpcomingSessionsCount() { return upcomingSessionsCount; }
    public void setUpcomingSessionsCount(long upcomingSessionsCount) { this.upcomingSessionsCount = upcomingSessionsCount; }

    public String getAdvisorName() { return advisorName; }
    public void setAdvisorName(String advisorName) { this.advisorName = advisorName; }

    public String getAdvisorTitle() { return advisorTitle; }
    public void setAdvisorTitle(String advisorTitle) { this.advisorTitle = advisorTitle; }

    public String getAdvisorInitials() { return advisorInitials; }
    public void setAdvisorInitials(String advisorInitials) { this.advisorInitials = advisorInitials; }

    public boolean isAcceptingStartups() { return acceptingStartups; }
    public void setAcceptingStartups(boolean acceptingStartups) { this.acceptingStartups = acceptingStartups; }

    public List<SessionDto> getUpcomingSessions() { return upcomingSessions; }
    public void setUpcomingSessions(List<SessionDto> upcomingSessions) { this.upcomingSessions = upcomingSessions; }

    public List<MentorshipDto> getActiveMentorships() { return activeMentorships; }
    public void setActiveMentorships(List<MentorshipDto> activeMentorships) { this.activeMentorships = activeMentorships; }

    public List<PendingRequestDto> getPendingRequestList() { return pendingRequestList; }
    public void setPendingRequestList(List<PendingRequestDto> pendingRequestList) { this.pendingRequestList = pendingRequestList; }

    public List<ActivityDto> getRecentActivity() { return recentActivity; }
    public void setRecentActivity(List<ActivityDto> recentActivity) { this.recentActivity = recentActivity; }
}
