package com.platform.SheConnect.service;

import java.util.List;

import org.springframework.boot.security.autoconfigure.SecurityProperties.User;
import org.springframework.stereotype.Service;

import com.platform.SheConnect.entity.Comment;
import com.platform.SheConnect.entity.Like;
import com.platform.SheConnect.entity.StartUpIdea;
import com.platform.SheConnect.exception.ResourceNotFoundException;
import com.platform.SheConnect.repository.CommentRepository;
import com.platform.SheConnect.repository.LikeRepository;
import com.platform.SheConnect.repository.StartUpIdeaRepository;
import com.platform.SheConnect.repository.UserRepository;

import jakarta.transaction.Transactional;
@Service
@Transactional
public class InteractionService {
    private LikeRepository likeRepository;
    private CommentRepository commentRepository;
    private StartUpIdeaRepository startUpIdeaRepository;
    private UserRepository userRepository;

    public InteractionService(LikeRepository likeRepository, CommentRepository commentRepository, StartUpIdeaRepository startUpIdeaRepository, UserRepository userRepository) {
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
        this.startUpIdeaRepository = startUpIdeaRepository;
        this.userRepository = userRepository;
    }

    public Long countLikesByStartupIdeaId(Long startupIdeaId) {
        return likeRepository.countByStartupIdeaId(startupIdeaId);
    }
    public List<StartUpIdea> getStartupIdeasByIndustry(String industryName) {
        return startUpIdeaRepository.findAllByIndustry_Name(industryName);
    }
    public Comment addCommentToStartupIdea(Long startupIdeaId, Long userId, String content) {
        Comment comment = new Comment();
        comment.setContent(content);
        comment.setStartupIdea(startUpIdeaRepository.findById(startupIdeaId).orElseThrow(() -> new ResourceNotFoundException(
            "startup idea  not found with id: " + startupIdeaId
        ))); 
        comment.setUser(userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException(
            "user  not found with id: "+ userId 
        ))); 
        return commentRepository.save(comment);
    }
    public boolean hasUserLikedStartupIdea(Long startupIdeaId, Long userId) {
        return likeRepository.findByStartupIdeaIdAndUserId(startupIdeaId, userId).isPresent();
    }
    public void unlikeStartupIdea(Long startupIdeaId, Long userId) {
        likeRepository.deleteByStartupIdeaIdAndUserId(startupIdeaId, userId);
    }
    public void likeStartupIdea(Long startupIdeaId, Long userId) {
        if (!hasUserLikedStartupIdea(startupIdeaId, userId)) {
            Like like = new Like();
            like.setStartupIdea(startUpIdeaRepository.findById(startupIdeaId).orElseThrow(() -> new ResourceNotFoundException(
            "startup idea  not found with id: " + startupIdeaId
        ))); 
            like.setUser(userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException(
            "user  not found with id: "+ userId 
        ))); 
            likeRepository.save(like);
        }
    }
}
