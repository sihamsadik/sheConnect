package com.platform.SheConnect.config;

import com.platform.SheConnect.entity.Role;
import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.entity.EntrepreneurNeed;
import com.platform.SheConnect.entity.Industry;

import com.platform.SheConnect.repository.EntrepreneurNeedRepository;
import com.platform.SheConnect.repository.IndustryRepository;
import com.platform.SheConnect.repository.RoleRepository;
import com.platform.SheConnect.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final EntrepreneurNeedRepository entrepreneurNeedRepository;
    private final IndustryRepository industryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            RoleRepository roleRepository, 
            EntrepreneurNeedRepository entrepreneurNeedRepository, 
            IndustryRepository industryRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.roleRepository = roleRepository;
        this.entrepreneurNeedRepository = entrepreneurNeedRepository;
        this.industryRepository = industryRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (roleRepository.findByName("ADMIN").isEmpty()) {
            roleRepository.save(new Role(null, "ADMIN"));
        }

        if (roleRepository.findByName("INVESTOR").isEmpty()) {
            roleRepository.save(new Role(null, "INVESTOR"));
        }

        if (roleRepository.findByName("ENTREPRENEUR").isEmpty()) {
            roleRepository.save(new Role(null, "ENTREPRENEUR"));
        }

        if (roleRepository.findByName("ADVISOR").isEmpty()) {
            roleRepository.save(new Role(null, "ADVISOR"));
        }

        // Seed default platform admin if not existing
        if (userRepository.findByEmail("admin@sheconnect.com").isEmpty()) {
            Role adminRole = roleRepository.findByName("ADMIN").orElse(null);
            if (adminRole != null) {
                User admin = new User();
                admin.setName("Platform Administrator");
                admin.setEmail("admin@sheconnect.com");
                admin.setPassword(passwordEncoder.encode("Password123!"));
                admin.setRole(adminRole);
                admin.setTitle("Head of Platform Operations");
                admin.setLocation("San Francisco, CA");
                admin.setBio("Overseeing sheConnect founder verification, investor diligence, and platform trust & safety.");
                userRepository.save(admin);
                System.out.println("Default platform admin created: admin@sheconnect.com / Password123!");
            }
        }

        if (entrepreneurNeedRepository.findByName("INVESTOR").isEmpty()) {
            System.out.println("Creating default entrepreneur needs...");
            entrepreneurNeedRepository.save(new EntrepreneurNeed(null, "INVESTOR"));
        }
        if (entrepreneurNeedRepository.findByName("ADVISOR").isEmpty()) {
            System.out.println("Creating default entrepreneur needs...");
            entrepreneurNeedRepository.save(new EntrepreneurNeed(null, "ADVISOR"));
        }
        if (entrepreneurNeedRepository.findByName("BOTH").isEmpty()) {
            entrepreneurNeedRepository.save(new EntrepreneurNeed(null, "BOTH"));
        }
        if (industryRepository.findByName("FINTECH").isEmpty()) {
            industryRepository.save(new Industry(null, "FINTECH"));
        }
        if (industryRepository.findByName("HEALTHCARE").isEmpty()) {
            System.out.println("Creating default industries...");
            industryRepository.save(new Industry(null, "HEALTHCARE"));
        }
        if (industryRepository.findByName("EDUCATION").isEmpty()) {
            industryRepository.save(new Industry(null, "EDUCATION"));
        }
        if (industryRepository.findByName("AI / MACHINE LEARNING").isEmpty()) {
            industryRepository.save(new Industry(null, "AI / MACHINE LEARNING"));
        }
        if (industryRepository.findByName("B2B SAAS").isEmpty()) {
            industryRepository.save(new Industry(null, "B2B SAAS"));
        }

        System.out.println("Default roles and seed data created if not existing.");
    }
}