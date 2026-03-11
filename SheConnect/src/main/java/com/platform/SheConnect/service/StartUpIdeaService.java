package com.platform.SheConnect.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.platform.SheConnect.dto.CreateStartUpIdeaRequest;
import com.platform.SheConnect.entity.EntrepreneurNeed;
import com.platform.SheConnect.entity.Industry;
import com.platform.SheConnect.entity.StartUpIdea;
import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.repository.EntrepreneurNeedRepository;
import com.platform.SheConnect.repository.IndustryRepository;
import com.platform.SheConnect.repository.StartUpIdeaRepository;

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
            throw new IllegalArgumentException("User required");
        }
        if (request == null) {
            throw new IllegalArgumentException("Request required");
        }

        if (isBlank(request.getTitle()) || isBlank(request.getProblem()) || isBlank(request.getSolution())
                || isBlank(request.getTargetMarket()) || isBlank(request.getIndustryName())) {
            throw new IllegalArgumentException("title, problem, solution, targetMarket, industryName are required");
        }

        Industry industry = industryRepository.findByName(request.getIndustryName().trim())
                .orElseThrow(() -> new IllegalArgumentException("Unknown industry: " + request.getIndustryName()));

        Set<EntrepreneurNeed> lookingFor = new HashSet<>();
        if (request.getLookingFor() != null) {
            for (String needName : request.getLookingFor()) {
                if (isBlank(needName)) {
                    continue;
                }
                EntrepreneurNeed need = entrepreneurNeedRepository.findByName(needName.trim())
                        .orElseThrow(() -> new IllegalArgumentException("Unknown entrepreneur need: " + needName));
                lookingFor.add(need);
            }
        }

        StartUpIdea idea = new StartUpIdea();
        idea.setTitle(request.getTitle().trim());
        idea.setProblem(request.getProblem().trim());
        idea.setSolution(request.getSolution().trim());
        idea.setTargetMarket(request.getTargetMarket().trim());
        idea.setIndustry(industry);
        idea.setLookingFor(lookingFor);
        idea.setUser(user);

        return startUpIdeaRepository.save(idea);
    }

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
