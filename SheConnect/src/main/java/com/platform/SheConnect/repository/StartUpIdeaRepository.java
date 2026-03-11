package com.platform.SheConnect.repository;

import com.platform.SheConnect.entity.StartUpIdea;
import com.platform.SheConnect.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StartUpIdeaRepository extends JpaRepository<StartUpIdea, Long> {
    Optional<StartUpIdea> findById(Long id);
    Optional<StartUpIdea> findByTitle(String title);    
    List<StartUpIdea> findAllByUser(User user);
    
    
    void deleteById(Long id);

}
