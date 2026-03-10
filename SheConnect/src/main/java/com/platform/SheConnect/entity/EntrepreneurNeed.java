package com.platform.SheConnect.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name= "entrepreneur_needs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EntrepreneurNeed {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
   

}
