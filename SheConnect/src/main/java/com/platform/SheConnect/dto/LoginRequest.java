package com.platform.SheConnect.dto;

public class LoginRequest {

    private String email;
    private String password;

    public LoginRequest(String email, String password) {}
    public String setEmail(String email) { this.email = email; return email; }
    public String setPassword(String password) { this.password = password; return password; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
}