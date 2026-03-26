package com.platform.SheConnect.service;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.platform.SheConnect.dto.LoginRequest;
import com.platform.SheConnect.dto.LoginResponse;
import com.platform.SheConnect.dto.RegisterRequest;
import com.platform.SheConnect.security.JwtService;
import com.platform.SheConnect.entity.RefreshToken;
import com.platform.SheConnect.entity.Role;
import com.platform.SheConnect.security.RefreshTokenService;
import lombok.extern.slf4j.Slf4j;
import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.exception.ResourceNotFoundException;
import com.platform.SheConnect.exception.UnauthorizedException;
import com.platform.SheConnect.repository.RoleRepository;
import org.springframework.stereotype.Service;

@Slf4j
@Service

public class AuthService {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RoleRepository roleRepository;
    private final RefreshTokenService refreshTokenService;

    public AuthService(UserService userService, PasswordEncoder passwordEncoder, JwtService jwtService, RoleRepository roleRepository, RefreshTokenService refreshTokenService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.roleRepository = roleRepository;
        this.refreshTokenService = refreshTokenService;
    }
   public LoginResponse LoginService(LoginRequest request) {
        User user = userService.findUserByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
         RefreshToken refreshToken =
             refreshTokenService.createRefreshToken(user);
        

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.error("user with id {} password is incorrect",user.getId() );
            throw new UnauthorizedException("Invalid credentials");
        }
        log.info("user logged in");

        return new LoginResponse(user.getName(), user.getEmail(), user.getRole().getName(), jwtService.generateAccessToken(user.getEmail(), user.getRole().getName()), refreshToken);
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
            log.error("user did not enter name");
            throw new IllegalArgumentException("Name required");
        }

        if (request.getEmail() == null || request.getEmail().isEmpty()) {
             log.error("user did not enter email");
            throw new IllegalArgumentException("Email required");
        }

        if (!isStrongPassword(request.getPassword())) {
             log.error("user did not enter password ");
            throw new IllegalArgumentException("Weak password");
        }

        // 2️⃣ Check email already exists
        if (userService.findUserByEmail(request.getEmail()).isPresent()) {
             log.error("user enter the email that is registered before");
            throw new IllegalArgumentException("Email already used");
        }

        // 3️⃣ Get role from DB
        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new ResourceNotFoundException(
            "Role name not found : "
        ));

        // 4️⃣ Encrypt password
        // request.setPassword(passwordEncoder.encode(request.getPassword()));
        request.setRole(role.getName());

       
                
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        User savedUser = userService.saveUser(user);
         RefreshToken refreshToken =
             refreshTokenService.createRefreshToken(savedUser);

        return new LoginResponse(savedUser.getName(), savedUser.getEmail(), savedUser.getRole().getName(), jwtService.generateAccessToken(savedUser.getEmail(), savedUser.getRole().getName()), refreshToken);
    }


}
