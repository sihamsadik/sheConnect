package com.platform.SheConnect.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class RegisterRequest {
    @NotBlank(message = "name can not be blank")
    private String name;
    @NotBlank(message = "email can not be blank")
    @Email(message= "email must be valid")
    private String email;
    @NotBlank(message = "password can not be blank")
    private String password;
    @NotBlank(message = "Role is required")
    @Pattern(regexp = "ENTREPRENEUR|INVESTOR|ADVISOR", 
             message = "Role must be ENTREPRENEUR, INVESTOR, or ADVISOR")
    private String role;

    public RegisterRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}