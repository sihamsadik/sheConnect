package com.platform.SheConnect.dto;

public class AdvisorSettingsDto {

    private String name;
    private String email;
    private String title;
    private String location;
    private String bio;
    private String focusIndustries;

    // password change fields (only used on PUT /settings/password)
    private String currentPassword;
    private String newPassword;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getFocusIndustries() { return focusIndustries; }
    public void setFocusIndustries(String focusIndustries) { this.focusIndustries = focusIndustries; }

    public String getCurrentPassword() { return currentPassword; }
    public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}
