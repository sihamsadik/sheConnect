package com.platform.SheConnect.service;

import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.repository.RoleRepository;
import com.platform.SheConnect.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public UserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    // Save user entity to database
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // Find user by email
    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}