package com.platform.SheConnect.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.security.Key;
import java.util.Date;


@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String secretKey;
    @Value("${jwt.expiration}")
    private long expirationTime;
    public String generateToken(String email, String role) {
        // Implement JWT token generation logic here
        
        Key key = Keys.hmacShaKeyFor(secretKey.getBytes());
        // Use a JWT library like io.jsonwebtoken.Jwts to create the token
        String token = Jwts.builder()
                .setSubject(email)
                .claim("role",role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
        return token;  
    }
}