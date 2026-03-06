package com.platform.SheConnect.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
// import org.apache.catalina.User;
import org.springframework.http.ResponseEntity;
import com.platform.SheConnect.security.RefreshTokenService;
import com.platform.SheConnect.security.JwtService;

// import com.platform.SheConnect.service.RegisterService;
import com.platform.SheConnect.service.AuthService;

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
    public ResponseEntity<LoginResponse> register(@RequestBody RegisterRequest request) {
        LoginResponse response = authService.RegisterService(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.LoginService(request);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestBody String refreshToken) {
        refreshTokenService.deleteRefreshToken(refreshToken);
        return ResponseEntity.ok("Logged out successfully");
    }
    @PostMapping("/refresh")
    public ResponseEntity<RefreshResponse> refresh(@RequestBody String refreshToken) {

        User user = refreshTokenService.validateRefreshToken(refreshToken).getUser();
         RefreshToken response = refreshTokenService.validateRefreshToken(refreshToken);
        if (response == null) {
            return ResponseEntity.status(401).body(null);
        }
        String newAccessToken = jwtService.generateAccessToken(user.getEmail(), user.getRole().getName());
        String newRefreshToken = refreshTokenService.createRefreshToken(user).getToken();

        RefreshResponse refreshResponse = new RefreshResponse(newAccessToken, newRefreshToken);
        return ResponseEntity.ok(refreshResponse);
    }

    }
        
    
