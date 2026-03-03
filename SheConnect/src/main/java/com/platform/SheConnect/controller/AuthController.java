package com.platform.SheConnect.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.http.ResponseEntity;

// import com.platform.SheConnect.service.RegisterService;
import com.platform.SheConnect.service.AuthService;

import com.platform.SheConnect.dto.LoginRequest;
import com.platform.SheConnect.dto.LoginResponse;
import com.platform.SheConnect.dto.RegisterRequest;
import com.platform.SheConnect.entity.User;


@RestController
@RequestMapping("/auth")

public class AuthController {
    // private final RegisterService registerService;
    private final AuthService authService;

    // private final LoginService loginService;

    public AuthController(AuthService authService) {
        // this.registerService = registerService;
        this.authService = authService;
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
}