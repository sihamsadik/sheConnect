package com.platform.SheConnect.repository;

import com.platform.SheConnect.entity.StartUpIdea;
import com.platform.SheConnect.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StartUpIdeaRepository extends JpaRepository<StartUpIdea, Long> {
    Optional<StartUpIdea> findById(Long id);
    Optional<StartUpIdea> findByTitle(String title);    
    List<StartUpIdea> findAllByUser(User user);
    
    
    void deleteById(Long id);
      // 1. Count startup ideas by user
    long countByUserId(Long userId);

    // 2. Sum of likes of all startup ideas by user
    @Query("SELECT COALESCE(SUM(s.likes),0) FROM StartUpIdea s WHERE s.user.id = :userId")
    Integer totalLikesByUser(@Param("userId") Long userId);

    // 3. Count comments of all startup ideas by user
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.startupIdea.user.id = :userId")
    Long totalCommentsByUser(@Param("userId") Long userId);


}
