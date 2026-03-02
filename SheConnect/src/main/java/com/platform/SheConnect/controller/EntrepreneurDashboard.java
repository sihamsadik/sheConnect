package com.platform.SheConnect.controller;

// public package com.platform.SheConnect.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EntrepreneurDashboard {

    @GetMapping("/entrepreneur/dashboard")
    public String dashboard() {
        System.out.println("Accessing Entrepreneur Dashboard");
        return "Welcome Entrepreneur!";
    }
} 
