package com.platform.SheConnect.service;

import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.service.UserService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;  
import org.springframework.security.core.credentials.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.crypto.password.PasswordEncoder;
