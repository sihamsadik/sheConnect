package com.platform.SheConnect.config;

import com.platform.SheConnect.entity.Role;
import com.platform.SheConnect.entity.EntrepreneurNeed;
import com.platform.SheConnect.entity.Industry;

import com.platform.SheConnect.repository.EntrepreneurNeedRepository;
import com.platform.SheConnect.repository.IndustryRepository;
import com.platform.SheConnect.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final EntrepreneurNeedRepository entrepreneurNeedRepository;
    private final IndustryRepository industryRepository;

    public DataInitializer(RoleRepository roleRepository, EntrepreneurNeedRepository entrepreneurNeedRepository, IndustryRepository industryRepository) {
        this.roleRepository = roleRepository;
        this.entrepreneurNeedRepository = entrepreneurNeedRepository;
        this.industryRepository = industryRepository;
    }

    @Override
    public void run(String... args) {

        if (roleRepository.findByName("INVESTOR").isEmpty()) {
            roleRepository.save(new Role(null, "INVESTOR"));
        }

        if (roleRepository.findByName("ENTREPRENEUR").isEmpty()) {
            roleRepository.save(new Role(null, "ENTREPRENEUR"));
        }

        if (roleRepository.findByName("ADVISOR").isEmpty()) {
            roleRepository.save(new Role(null, "ADVISOR"));
        }
        if (entrepreneurNeedRepository.findByName("INVESTOR").isEmpty()) {
            entrepreneurNeedRepository.save(new EntrepreneurNeed(null, "INVESTOR"));
        }
        if (entrepreneurNeedRepository.findByName("ADVISOR").isEmpty()) {
            entrepreneurNeedRepository.save(new EntrepreneurNeed(null, "ADVISOR"));
        }
        if (entrepreneurNeedRepository.findByName("BOTH").isEmpty()) {
            entrepreneurNeedRepository.save(new EntrepreneurNeed(null, "BOTH"));
        }
        if (industryRepository.findByName("FINTECH").isEmpty()) {
            industryRepository.save(new Industry(null, "FINTECH"));
        }
        if (industryRepository.findByName("HEALTHCARE").isEmpty()) {
            industryRepository.save(new Industry(null, "HEALTHCARE"));
        }
        if (industryRepository.findByName("EDUCATION").isEmpty()) {
            industryRepository.save(new Industry(null, "EDUCATION"));
        }
        

        System.out.println("Default roles created if not existing.");
    }
}