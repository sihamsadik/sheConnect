package com.platform.SheConnect.security;


import com.platform.SheConnect.security.JwtService;
import com.platform.SheConnect.service.UserService;

import java.io.IOException;
// import io.jsonwebtoken.lang.Collections;
import java.util.Collections;

import com.platform.SheConnect.entity.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.List;
import org.springframework.web.filter.OncePerRequestFilter;


@Component

public class JwtAuthenticationFilter extends OncePerRequestFilter {
    

    private final JwtService jwtService;
    private final UserService userService;

    public JwtAuthenticationFilter(JwtService jwtService, UserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }
    

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
                System.out.println("JwtAuthenticationFilter initialized");

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            System.out.println("No Authorization header or does not start with Bearer");
            return;
        }

        String token = authHeader.substring(7);
        System.out.println("TOKEN RECEIVED: " + token);
        String email = jwtService.extractEmail(token);

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            User user = userService.findUserByEmail(email).orElse(null);

            if (user != null && jwtService.validateToken(token)) {
                System.out.println("Valid token for user: " + email);

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().getName()))
                        );

                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        System.out.println("iiiiiii");
        User user = userService.findUserByEmail(email).orElse(null);
        System.out.println("ROLE FROM DB: " + user.getRole().getName());

        filterChain.doFilter(request, response);
    }
}