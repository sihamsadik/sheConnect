package com.platform.SheConnect.config;

import com.platform.SheConnect.entity.Role;
import com.platform.SheConnect.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public DataInitializer(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {

        if (roleRepository.findByName("INVESTOR").isEmpty()) {
            roleRepository.save(new Role(null, "INVESTOR"));
        }

        if (roleRepository.findByName("ENTREPRENEUR").isEmpty()) {
            roleRepository.save(new Role(null, "ENTREPRENEUR"));
        }

        if (roleRepository.findByName("LEGAL ADVISOR").isEmpty()) {
            roleRepository.save(new Role(null, "LEGAL ADVISOR"));
        }
        if (roleRepository.findByName("MARKET ADVISOR").isEmpty()) {
            roleRepository.save(new Role(null, "MARKET ADVISOR"));
        }
        if (roleRepository.findByName("BUSINESS ADVISOR").isEmpty()) {
            roleRepository.save(new Role(null, "BUSINESS ADVISOR"));
        }
        if (roleRepository.findByName("ADVISOR").isEmpty()) {
            roleRepository.save(new Role(null, "ADVISOR"));
        }
        if (roleRepository.findByName("TECH ADVISOR").isEmpty()) {
            roleRepository.save(new Role(null, "TECH ADVISOR"));
        }
        if (roleRepository.findByName("FINANCE ADVISOR").isEmpty()) {
            roleRepository.save(new Role(null, "FINANCE ADVISOR"));
        }

        System.out.println("Default roles created if not existing.");
    }
}