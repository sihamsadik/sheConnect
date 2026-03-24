package com.platform.SheConnect.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.platform.SheConnect.repository.InvestorInterestRepository;
import com.platform.SheConnect.repository.StartUpIdeaRepository;
import com.platform.SheConnect.entity.EntrepreneurNeed;
import com.platform.SheConnect.entity.Industry;
import com.platform.SheConnect.entity.StartUpIdea;
import com.platform.SheConnect.repository.CommentRepository;
import com.platform.SheConnect.repository.LikeRepository;

@Service
public class InvestorDashboardService {
    private final StartUpIdeaRepository startUpIdeaRepository;
    private final InvestorInterestRepository investorInterestRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;

    public InvestorDashboardService(StartUpIdeaRepository startUpIdeaRepository, InvestorInterestRepository investorInterestRepository, CommentRepository commentRepository, LikeRepository likeRepository) {
        this.startUpIdeaRepository = startUpIdeaRepository;
        this.investorInterestRepository = investorInterestRepository;
        this.commentRepository = commentRepository;
        this.likeRepository = likeRepository;
    }

    public List<StartUpIdea> getAllStartUpIdea() {
        return startUpIdeaRepository.findAll();
        
    }
    

    public List<StartUpIdea> getIdeasByIndustry(Industry industry){
        return startUpIdeaRepository.findAllByIndustry(industry);
    }
    public long getInvestorInterestCount(Long userId) {
        return investorInterestRepository.countByInvestorId(userId);
    }
    
     public long getTotalLikes(Long userId) {
        return likeRepository.countByUserId(userId);
     }

     public long getTotalComments(Long userId) {
        return commentRepository.countByUserId(userId);
    }


    public List<StartUpIdea> getIdeasByEntrepreneurNeed(String entrepreneurNeed){
        return startUpIdeaRepository.findAllByLookingFor_Name(entrepreneurNeed);
    }
}