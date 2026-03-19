package com.platform.SheConnect.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


import com.platform.SheConnect.entity.Like;

public interface LikeRepository extends JpaRepository<Like,Long> {
    
    Long countByStartupIdeaId(Long startupIdeaId);
    Optional<Like> findByStartupIdeaIdAndUserId(Long startupIdeaId, Long userId);
    void deleteByStartupIdeaIdAndUserId(Long startupIdeaId, Long userId);
    

} 