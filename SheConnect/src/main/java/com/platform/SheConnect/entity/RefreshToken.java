package com.platform.SheConnect.entity;
import jakarta.persistence.*;   
import lombok.*;

import jakarta.validation.constraints.*;            

@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String token;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    
}

