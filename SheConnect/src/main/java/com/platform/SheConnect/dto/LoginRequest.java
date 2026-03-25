package com.platform.SheConnect.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @NotBlank(message = "email can not be blank")
    @Email(message = "email must be valid")
    private String email;
    @NotBlank(message = "password can not be blank")
    private String password;

    public LoginRequest() {} // Default constructor for Spring

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}