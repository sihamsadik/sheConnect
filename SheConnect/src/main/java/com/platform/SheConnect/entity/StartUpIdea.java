package com.platform.SheConnect.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name= "startup_ideas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StartUpIdea {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)

    private String title;
    @Column(nullable = false, length = 2000)
    private String description;         
    @Column(nullable = false, length = 2000)
    private String problem;
    @Column(nullable = false, length = 2000)
    private String solution;
    @Column(nullable = false)
    private String targetMarket;
    @Column(nullable= false)
    private Integer likes = 0;

    @OneToMany(mappedBy = "startupIdea", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "industry_id", nullable = false)
    private Industry industry;

    @ManyToMany
    @JoinTable(
            name = "startup_idea_entrepreneur_needs",
            joinColumns = @JoinColumn(name = "startup_idea_id"),
            inverseJoinColumns = @JoinColumn(name = "entrepreneur_need_id")
    )
    private Set<EntrepreneurNeed> lookingFor = new HashSet<>();
    

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = (this.createdAt == null) ? now : this.createdAt;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }


}
