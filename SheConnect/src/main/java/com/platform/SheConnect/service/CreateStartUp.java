package com.platform.SheConnect.service;

import com.platform.SheConnect.entity.StartUpIdea;
import com.platform.SheConnect.repository.StartUpIdeaRepository;

public class DashboardService {
    // Add your service methods here
    private StartUpIdeaRepository startUpIdeaRepository;

    public DashboardService(StartUpIdeaRepository startUpIdeaRepository) {
        this.startUpIdeaRepository = startUpIdeaRepository;
    }

    public Boolean iStartUpIdea(String title, String description) {
        StartUpIdea startupidea = startUpIdeaRepository.findByTitle(title).orElse(null);
        if (startupidea != null) {
           
           if (startupidea.getDescription().equals(description)) {
               return false;
            
           }
           return true;
        }
        return startupidea != null;
    }
    public StartUpIdea saveStartUpIdea(StartUpIdea startupidea) {
        return startUpIdeaRepository.save(startupidea);
    }
    
}
