package com.platform.SheConnect.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "investor_interested")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class InvestorInterested {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name ="investor_id", nullable = false)
    private User investor;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "startup_idea_id", nullable = false)
    private StartUpIdea startUpIdea;
    

    @Column(name = "stage")
    private String stage = "SCREENING";

    @Column(name = "notes", length = 1000)
    private String notes;

    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;

    public InvestorInterested(User investor, StartUpIdea startUpIdea, String stage) {
        this.investor = investor;
        this.startUpIdea = startUpIdea;
        this.stage = (stage != null && !stage.isBlank()) ? stage : "SCREENING";
    }

    @PrePersist
    void onCreate() {
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        if (this.createdAt == null) {
            this.createdAt = now;
        }
        this.updatedAt = now;
        if (this.stage == null || this.stage.isBlank()) {
            this.stage = "SCREENING";
        }
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = java.time.LocalDateTime.now();
    }

    public String getStage() {
        return stage != null ? stage : "SCREENING";
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

    public java.time.LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(java.time.LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public java.time.LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(java.time.LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
