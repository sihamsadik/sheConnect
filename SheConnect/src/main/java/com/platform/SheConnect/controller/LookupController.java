package com.platform.SheConnect.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.platform.SheConnect.repository.EntrepreneurNeedRepository;
import com.platform.SheConnect.repository.IndustryRepository;

@RestController
@RequestMapping("/api/lookup")
public class LookupController {
    private final IndustryRepository industryRepository;
    private final EntrepreneurNeedRepository entrepreneurNeedRepository;

    public LookupController(IndustryRepository industryRepository, EntrepreneurNeedRepository entrepreneurNeedRepository) {
        this.industryRepository = industryRepository;
        this.entrepreneurNeedRepository = entrepreneurNeedRepository;
    }

    @GetMapping("/industries")
    public List<String> industries() {
        return industryRepository.findAll().stream().map(i -> i.getName()).sorted().toList();
    }

    @GetMapping("/entrepreneur-needs")
    public List<String> entrepreneurNeeds() {
        return entrepreneurNeedRepository.findAll().stream().map(n -> n.getName()).sorted().toList();
    }
}
