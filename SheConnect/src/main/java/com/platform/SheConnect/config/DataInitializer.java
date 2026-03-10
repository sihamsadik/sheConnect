package com.platform.SheConnect.config;

import com.platform.SheConnect.entity.Role;

import com.platform.SheConnect.repository.EnterpreneurNeedRepository;
import com.platform.SheConnect.repository.IndustryRepository;
import com.platform.SheConnect.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final EnterpreneurNeedRepository enterpreneurNeedRepository;
    private final IndustryRepository industryRepository;

    public DataInitializer(RoleRepository roleRepository, EnterpreneurNeedRepository enterpreneurNeedRepository, IndustryRepository industryRepository) {
        this.roleRepository = roleRepository;
        this.enterpreneurNeedRepository = enterpreneurNeedRepository;
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
        if (enterpreneurNeedRepository.findByName("INVESTOR").isEmpty()) {
            enterpreneurNeedRepository.save(new EnterpreneurNeed(null, "INVESTOR"));
        }
        
       

        System.out.println("Default roles created if not existing.");
    }
}