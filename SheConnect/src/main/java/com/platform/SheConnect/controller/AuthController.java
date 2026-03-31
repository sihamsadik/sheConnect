package com.platform.SheConnect.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
// import org.apache.catalina.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.platform.SheConnect.security.RefreshTokenService;
import com.platform.SheConnect.security.JwtService;

// import com.platform.SheConnect.service.RegisterService;
import com.platform.SheConnect.dto.RefreshTokenRequest;
import com.platform.SheConnect.service.AuthService;

import jakarta.validation.Valid;

import com.platform.SheConnect.dto.LoginRequest;
import com.platform.SheConnect.dto.LoginResponse;
import com.platform.SheConnect.dto.RefreshResponse;


import com.platform.SheConnect.dto.RegisterRequest;
import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.entity.RefreshToken;


@RestController
@RequestMapping("/auth")

public class AuthController {
    // private final RegisterService registerService;
    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;

    // private final LoginService loginService;

    public AuthController(AuthService authService, RefreshTokenService refreshTokenService, JwtService jwtService) {
        // this.registerService = registerService;
        this.authService = authService;
        this.refreshTokenService = refreshTokenService;
        this.jwtService = jwtService;
    }
    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@Valid @RequestBody RegisterRequest request) {
        LoginResponse response = authService.RegisterService(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.LoginService(request);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@Valid @RequestBody RefreshTokenRequest refreshToken) {
        refreshTokenService.deleteRefreshToken(refreshToken.getRefreshToken());
        return ResponseEntity.ok("Logged out successfully");
    }
    @PostMapping("/refresh")
    public ResponseEntity<RefreshResponse> refresh(@Valid @RequestBody RefreshTokenRequest refreshTokenRequest) {

        RefreshToken refreshToken = refreshTokenService.validateRefreshToken(refreshTokenRequest.getRefreshToken());
        User user = refreshToken.getUser();
        refreshTokenService.deleteRefreshToken(refreshTokenRequest.getRefreshToken());
        String newAccessToken = jwtService.generateAccessToken(user.getEmail(), user.getRole().getName());
        String newRefreshToken = refreshTokenService.createRefreshToken(user).getToken();

        RefreshResponse refreshResponse = new RefreshResponse(newAccessToken, newRefreshToken);
        return ResponseEntity.ok(refreshResponse);
    }

    }
        
    
