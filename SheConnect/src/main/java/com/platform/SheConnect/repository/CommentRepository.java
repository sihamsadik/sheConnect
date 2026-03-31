package com.platform.SheConnect.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.platform.SheConnect.entity.Comment;

public interface CommentRepository extends JpaRepository<Comment,Long> {
    Optional<Comment> findById(Long id);
    Long countByUserId(Long userId);
    Long countByStartupIdeaId(Long startupIdeaId);
    List<Comment> findByStartupIdeaId(Long startupIdeaId);
} 