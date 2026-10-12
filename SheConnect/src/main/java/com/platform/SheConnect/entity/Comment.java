package com.platform.SheConnect.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity
@Table(name= "comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 1000)
    private String content;

    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"})
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "startup_idea_id", nullable = false)
    private StartUpIdea startupIdea;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public StartUpIdea getStartupIdea() { return startupIdea; }
    public void setStartupIdea(StartUpIdea startupIdea) { this.startupIdea = startupIdea; }
    public LocalDateTime getCreatedAt() { return createdAt != null ? createdAt : LocalDateTime.now(); }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
