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

        if (roleRepository.findByName("ADVISOR").isEmpty()) {
            roleRepository.save(new Role(null, "ADVISOR"));
        }

        System.out.println("Default roles created if not existing.");
    }
}