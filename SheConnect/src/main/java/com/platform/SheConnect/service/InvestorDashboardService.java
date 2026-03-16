package com.platform.SheConnect.service;

import java.util.List;

import com.platform.SheConnect.repository.StartUpIdeaRepository;
import com.platform.SheConnect.entity.Industry;
import com.platform.SheConnect.entity.StartUpIdea;

public class InvestorDashboardService {
    private final StartUpIdeaRepository startUpIdeaRepository;

    public InvestorDashboardService(StartUpIdeaRepository startUpIdeaRepository){
        this.startUpIdeaRepository =startUpIdeaRepository;
    }
    public List<StartUpIdea> getAllStartUpIdea(){
        return startUpIdeaRepository.findAll();
        

    }
    public List<StartUpIdea> getIdeasByIndustry(Industry industry){
        return startUpIdeaRepository.findAllByIndustry(industry);
    }
    

    
}