package com.platform.SheConnect.repository;

import com.platform.SheConnect.entity.StartUpIdea;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StartUpIdeaRepository extends JpaRepository<StartUpIdea, Long> {
    Optional<StartUpIdea> findById(Long id);
    
    void deleteById(Long id);

}
