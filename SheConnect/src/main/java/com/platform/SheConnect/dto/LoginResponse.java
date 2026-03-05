package com.platform.SheConnect.dto;

import com.platform.SheConnect.entity.RefreshToken;

public class LoginResponse {

    private String name;
    private String email;
    private String role;
    private String token;
    private String refreshToken;


    public LoginResponse(String name, String email, String role, String token, RefreshToken refreshToken) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.token = token;
        this.refreshToken = refreshToken.getToken();
    }

    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getToken() { return token; }
    public String getRefreshToken() { return refreshToken; }
}