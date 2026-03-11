package com.platform.SheConnect.service;

import java.util.List;

import com.platform.SheConnect.entity.StartUpIdea;
import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.repository.StartUpIdeaRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final StartUpIdeaRepository startUpIdeaRepository;
    

    public DashboardService(StartUpIdeaRepository startUpIdeaRepository) {
        this.startUpIdeaRepository = startUpIdeaRepository;
        
    }
   

    public long getIdeaCount(Long userId) {
        return startUpIdeaRepository.countByUserId(userId);
    }

    public int getTotalLikes(Long userId) {
        return startUpIdeaRepository.totalLikesByUser(userId);
    }

    public long getTotalComments(Long userId) {
        return startUpIdeaRepository.totalCommentsByUser(userId);
    }
   public List<StartUpIdea> getAllStartupIdeas(User user) {
        return startUpIdeaRepository.findAllByUser(user);
    }
   
    public double getEngagementRate(Long userId) {
        long ideaCount = getIdeaCount(userId);
        if (ideaCount == 0) {
            return 0.0;
        }
        int totalLikes = getTotalLikes(userId);
        long totalComments = getTotalComments(userId);
        return (double) (totalLikes + totalComments) / ideaCount;
    }

}
