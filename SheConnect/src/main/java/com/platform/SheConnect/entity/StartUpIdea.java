package com.platform.SheConnect.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

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
    @ManyToMany
    @JoinColumn(name = "industry_id", nullable = false)
    private Industry industry;
    @ManyToMany
    @JoinColumn(name = "entrepreneur_need_id", nullable = false)
    private EntrepreneurNeed lookingFor;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;



    


}
