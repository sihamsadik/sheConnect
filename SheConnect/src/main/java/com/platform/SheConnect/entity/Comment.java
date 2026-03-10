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
   @Column(nullable = false,length = 1000)
    private String comment;
    @OneToMany
    @JoinColumn(name ="user_id", nullable = false)
    private User user;
    
}
