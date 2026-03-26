package com.platform.SheConnect.service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.platform.SheConnect.dto.CreateStartUpIdeaRequest;
import com.platform.SheConnect.entity.EntrepreneurNeed;
import com.platform.SheConnect.entity.Industry;
import com.platform.SheConnect.entity.StartUpIdea;
import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.exception.ResourceNotFoundException;
import com.platform.SheConnect.repository.EntrepreneurNeedRepository;
import com.platform.SheConnect.repository.IndustryRepository;
import com.platform.SheConnect.repository.StartUpIdeaRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class StartUpIdeaService {
    private final StartUpIdeaRepository startUpIdeaRepository;
    private final IndustryRepository industryRepository;
    private final EntrepreneurNeedRepository entrepreneurNeedRepository;

    public StartUpIdeaService(StartUpIdeaRepository startUpIdeaRepository, IndustryRepository industryRepository,
            EntrepreneurNeedRepository entrepreneurNeedRepository) {
        this.startUpIdeaRepository = startUpIdeaRepository;
        this.industryRepository = industryRepository;
        this.entrepreneurNeedRepository = entrepreneurNeedRepository;
    }

    public StartUpIdea create(User user, CreateStartUpIdeaRequest request) {
        if (user == null) {
            log.error("can not get the user");
            throw new IllegalArgumentException("User required");
        }
        if (request == null) {
            log.error("can not get the request");
            throw new IllegalArgumentException("Request required");
        }

        if (isBlank(request.getTitle()) || isBlank(request.getProblem()) || isBlank(request.getSolution())
                || isBlank(request.getTargetMarket()) || isBlank(request.getIndustryName())) {
            log.error("no fuul information is get for the start up idea");
            throw new IllegalArgumentException("title, problem, solution, targetMarket, industryName are required");
        }

        Industry industry = industryRepository.findByName(request.getIndustryName().trim())
                .orElseThrow(() -> new ResourceNotFoundException(
            "industry not found with id: " + request.getIndustryName()
        ));

        Set<EntrepreneurNeed> lookingFor = new HashSet<>();
        if (request.getLookingFor() != null) {
            for (String needName : request.getLookingFor()) {
                if (isBlank(needName)) {
                    continue;
                }
                EntrepreneurNeed need = entrepreneurNeedRepository.findByName(needName.trim())
                        .orElseThrow(() -> new ResourceNotFoundException(
            "enterprenuer need not found with id: " + needName
        )); 
                lookingFor.add(need);
            }
        }

        StartUpIdea idea = new StartUpIdea();
        idea.setTitle(request.getTitle().trim());
        idea.setProblem(request.getProblem().trim());
        idea.setSolution(request.getSolution().trim());
        idea.setTargetMarket(request.getTargetMarket().trim());
        idea.setIndustry(industry);
        idea.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        idea.setLookingFor(lookingFor);
        idea.setUser(user);
        log.info("user {} create startup idea",user.getId());

        return startUpIdeaRepository.save(idea);
    }
    public StartUpIdea getStartUpIdeasById(long id){

      final StartUpIdea ideaId = startUpIdeaRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException(
            " idea  not found with id: "+ id
        )); 
       return ideaId;
        
       
    }
    public List<StartUpIdea> MyIdeas(User user){
        List<StartUpIdea> userIdea = startUpIdeaRepository.findAllByUser(user);
        return userIdea;
    }

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
