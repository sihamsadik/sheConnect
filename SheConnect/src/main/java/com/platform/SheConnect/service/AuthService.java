package com.platform.SheConnect.service;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.platform.SheConnect.dto.LoginRequest;
import com.platform.SheConnect.dto.LoginResponse;
import com.platform.SheConnect.dto.RegisterRequest;
import com.platform.SheConnect.security.JwtService;
import com.platform.SheConnect.entity.Role;
import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.repository.RoleRepository;
import org.springframework.stereotype.Service;


@Service

public class AuthService {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RoleRepository roleRepository;

    public AuthService(UserService userService, PasswordEncoder passwordEncoder, JwtService jwtService, RoleRepository roleRepository) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.roleRepository = roleRepository;
    }
   public LoginResponse LoginService(LoginRequest request) {
        User user = userService.findUserByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
    throw new RuntimeException("Invalid credentials");
}

        return new LoginResponse(user.getName(), user.getEmail(), user.getRole().getName(), jwtService.generateToken(user.getEmail(), user.getRole().getName()));
    }
    private boolean isStrongPassword(String password) {
        if (password == null) return false;
        if (password.length() < 8) return false;
        if (!password.matches(".*[A-Z].*")) return false;
        if (!password.matches(".*[a-z].*")) return false;
        if (!password.matches(".*\\d.*")) return false;
        if (!password.matches(".*[!@#$%^&*()].*")) return false;
        return true;
    }

    public LoginResponse RegisterService(RegisterRequest request) {

        // 1️⃣ Basic validation
        if (request.getName() == null || request.getName().isEmpty()) {
            throw new RuntimeException("Name required");
        }

        if (request.getEmail() == null || request.getEmail().isEmpty()) {
            throw new RuntimeException("Email required");
        }

        if (!isStrongPassword(request.getPassword())) {
            throw new RuntimeException("Weak password");
        }

        // 2️⃣ Check email already exists
        if (userService.findUserByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already used");
        }

        // 3️⃣ Get role from DB
        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        // 4️⃣ Encrypt password
        // request.setPassword(passwordEncoder.encode(request.getPassword()));
        request.setRole(role.getName());
                
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        User savedUser = userService.saveUser(user);

        
        return new LoginResponse(savedUser.getName(), savedUser.getEmail(), savedUser.getRole().getName(), jwtService.generateToken(savedUser.getEmail(), savedUser.getRole().getName()));
    }


}
