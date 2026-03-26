package com.platform.SheConnect.service;

import org.springframework.stereotype.Service;

import com.platform.SheConnect.entity.StartUpIdea;

import com.platform.SheConnect.repository.StartUpIdeaRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class CreateStartUp {
    // Add your service methods here
    private StartUpIdeaRepository startUpIdeaRepository;

    public CreateStartUp(StartUpIdeaRepository startUpIdeaRepository) {
        this.startUpIdeaRepository = startUpIdeaRepository;
    }

    public Boolean iStartUpIdea(String title, String description) {
        log.info("user check is startup created");
        StartUpIdea startupidea = startUpIdeaRepository.findByTitle(title).orElse(null);
        if (startupidea != null) {
           
           if (startupidea.getDescription().equals(description)) {
                 log.error("user  created a start up idea already created");
               return false;
            
           }
           return true;
        }
        return startupidea != null;
    }
    public StartUpIdea saveStartUpIdea(StartUpIdea startupidea) {
        log.info("user {} create a startup idea", startupidea.getUser().getId());
        return startUpIdeaRepository.save(startupidea);
    }
    
}
