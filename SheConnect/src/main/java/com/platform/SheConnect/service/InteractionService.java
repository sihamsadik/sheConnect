package com.platform.SheConnect.service;

import java.util.List;

import com.platform.SheConnect.entity.User;
import org.springframework.stereotype.Service;

import com.platform.SheConnect.entity.Comment;
import com.platform.SheConnect.entity.AdvisorMentorship;
import com.platform.SheConnect.entity.Like;
import com.platform.SheConnect.entity.StartUpIdea;
import com.platform.SheConnect.exception.ResourceNotFoundException;
import com.platform.SheConnect.repository.AdvisorMentorshipRepository;
import com.platform.SheConnect.repository.CommentRepository;
import com.platform.SheConnect.repository.LikeRepository;
import com.platform.SheConnect.repository.StartUpIdeaRepository;
import com.platform.SheConnect.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
@Slf4j
@Service
@Transactional
public class InteractionService {
    private LikeRepository likeRepository;
    private CommentRepository commentRepository;
    private StartUpIdeaRepository startUpIdeaRepository;
    private UserRepository userRepository;
    private AdvisorMentorshipRepository advisorMentorshipRepository;

    public InteractionService(LikeRepository likeRepository, CommentRepository commentRepository, StartUpIdeaRepository startUpIdeaRepository, UserRepository userRepository, AdvisorMentorshipRepository advisorMentorshipRepository) {
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
        this.startUpIdeaRepository = startUpIdeaRepository;
        this.userRepository = userRepository;
        this.advisorMentorshipRepository = advisorMentorshipRepository;
    }

    public Long countLikesByStartupIdeaId(Long startupIdeaId) {
        return likeRepository.countByStartupIdeaId(startupIdeaId);
    }
    public List<StartUpIdea> getStartupIdeasByIndustry(String industryName) {
        log.info("user want to find startup idea by {}", industryName);
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
        log.info("user{} comment in startup idea {}",userId,startupIdeaId);
        return commentRepository.save(comment);
    }
    public boolean hasUserLikedStartupIdea(Long startupIdeaId, Long userId) {
        return likeRepository.findByStartupIdeaIdAndUserId(startupIdeaId, userId).isPresent();
    }
    public void unlikeStartupIdea(Long startupIdeaId, Long userId) {
        log.warn("user{} unliked startupidea {}",userId,startupIdeaId);
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
        log.info("user{} liked startup idea {}",userId,startupIdeaId);
            likeRepository.save(like);
        }
    }

    public AdvisorMentorship offerMentorship(Long startupIdeaId, Long advisorId, String message) {
        User advisor = userRepository.findById(advisorId).orElseThrow(() -> new ResourceNotFoundException(
                "user not found with id: " + advisorId
        ));
        String roleName = advisor.getRole() != null ? advisor.getRole().getName() : "";
        if (!"ADVISOR".equalsIgnoreCase(roleName)) {
            throw new IllegalArgumentException("Only advisors can offer mentorship from the marketplace.");
        }

        StartUpIdea idea = startUpIdeaRepository.findById(startupIdeaId).orElseThrow(() -> new ResourceNotFoundException(
                "startup idea not found with id: " + startupIdeaId
        ));
        if (idea.getUser() != null && idea.getUser().getId().equals(advisorId)) {
            throw new IllegalArgumentException("You cannot offer mentorship to your own startup idea.");
        }

        return advisorMentorshipRepository.findByAdvisorIdAndStartupIdeaId(advisorId, startupIdeaId)
                .orElseGet(() -> {
                    AdvisorMentorship mentorship = new AdvisorMentorship();
                    mentorship.setAdvisor(advisor);
                    mentorship.setMentee(idea.getUser());
                    mentorship.setStartupIdea(idea);
                    mentorship.setStatus("ACTIVE");
                    mentorship.setMentorshipType("Mentorship Offer");
                    mentorship.setRequestMessage(cleanMentorshipMessage(message, idea));
                    mentorship.setSprintGoal("Kickoff: review " + idea.getTitle() + " and agree on advisory goals.");
                    return advisorMentorshipRepository.save(mentorship);
                });
    }

    private String cleanMentorshipMessage(String message, StartUpIdea idea) {
        if (message != null && !message.isBlank()) {
            return message.trim();
        }
        return "I would like to offer mentorship for " + idea.getTitle() + ".";
    }
}
