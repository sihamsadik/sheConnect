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

    @Column(length = 1000)
    private String bio;

    private String title;

    public Long getId() { return Id; }
    public void setId(Long id) { this.Id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
}