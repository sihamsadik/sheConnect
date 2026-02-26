package com.platform.SheConnect.service;

import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.service.UserService;
import org.springframework.stereotype.Service;  
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
@Service

public class LoginService {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public LoginService(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse authenticate(LoginRequest request) {
        User user = userService.findUserByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }


        return new LoginResponse(user.getName(), user.getEmail(), user.getRole().getName());
    }

}