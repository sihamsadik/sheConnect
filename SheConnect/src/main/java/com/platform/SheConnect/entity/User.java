package com.platform.SheConnect.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;


@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    
    @Column(nullable = false)
    private String name;
    @Column(nullable = false, unique = true)
    private String email;
    @NotBlank
    // @Size(min = 8, message = "Password must be at least 8 characters long")
    // @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]+$", message = "Password must contain at least one letter and one number")
    @Column(nullable = false)
    private String password;
    
   
    @ManyToOne
    @JoinColumn(name = "role_id",nullable = false)
    private Role role;
    
}