package com.platform.SheConnect.dto;

public class LoginResponse {

    private String name;
    private String email;
    private String role;
    private String token;

    public LoginResponse(String name, String email, String role, String token) {
        this.name = name;
        this.email = email;
        this.role = role;
        this.token = token;
    }

    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getToken() { return token; }
}