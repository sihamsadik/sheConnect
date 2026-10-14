package com.platform.SheConnect.dto;

public class AdvisorProfileResponse {

    private Long id;
    private String name;
    private String title;
    private String location;
    private String bio;
    private String focusIndustries;
    private String initials;
    private long startupsAdvised;
    private boolean isOwner;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getFocusIndustries() { return focusIndustries; }
    public void setFocusIndustries(String focusIndustries) { this.focusIndustries = focusIndustries; }

    public String getInitials() { return initials; }
    public void setInitials(String initials) { this.initials = initials; }

    public long getStartupsAdvised() { return startupsAdvised; }
    public void setStartupsAdvised(long startupsAdvised) { this.startupsAdvised = startupsAdvised; }

    public boolean isOwner() { return isOwner; }
    public void setOwner(boolean owner) { isOwner = owner; }
}
