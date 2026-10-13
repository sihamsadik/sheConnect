package com.platform.SheConnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "advisor_mentorships")
public class AdvisorMentorship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The advisor who is mentoring */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "advisor_id", nullable = false)
    private User advisor;

    /** The entrepreneur being mentored */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentee_id", nullable = false)
    private User mentee;

    /** Startup idea this mentorship is attached to */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "startup_idea_id")
    private StartUpIdea startupIdea;

    /** PENDING | ACTIVE | DECLINED | COMPLETED */
    @Column(nullable = false)
    private String status = "PENDING";

    /** e.g. "Active Advisory" or "Mentorship" */
    private String mentorshipType;

    /** Current sprint / focus goal */
    @Column(length = 500)
    private String sprintGoal;

    /** Optional message from the entrepreneur when requesting */
    @Column(length = 1000)
    private String requestMessage;

    /** Scheduled session datetime (nullable – set when session is booked) */
    private LocalDateTime sessionScheduledAt;

    /** Session agenda */
    @Column(length = 500)
    private String sessionAgenda;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ----- Getters & Setters -----

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getAdvisor() { return advisor; }
    public void setAdvisor(User advisor) { this.advisor = advisor; }

    public User getMentee() { return mentee; }
    public void setMentee(User mentee) { this.mentee = mentee; }

    public StartUpIdea getStartupIdea() { return startupIdea; }
    public void setStartupIdea(StartUpIdea startupIdea) { this.startupIdea = startupIdea; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMentorshipType() { return mentorshipType; }
    public void setMentorshipType(String mentorshipType) { this.mentorshipType = mentorshipType; }

    public String getSprintGoal() { return sprintGoal; }
    public void setSprintGoal(String sprintGoal) { this.sprintGoal = sprintGoal; }

    public String getRequestMessage() { return requestMessage; }
    public void setRequestMessage(String requestMessage) { this.requestMessage = requestMessage; }

    public LocalDateTime getSessionScheduledAt() { return sessionScheduledAt; }
    public void setSessionScheduledAt(LocalDateTime sessionScheduledAt) { this.sessionScheduledAt = sessionScheduledAt; }

    public String getSessionAgenda() { return sessionAgenda; }
    public void setSessionAgenda(String sessionAgenda) { this.sessionAgenda = sessionAgenda; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
