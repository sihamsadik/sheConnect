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
    

    // Constructors, getters, and setters
}
