package com.platform.SheConnect.service;

import io.jsonwebtoken.Claims;
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
    private long expiration;

    // 🔐 Generate Token
    public String generateToken(String email, String role) {

        Key key = Keys.hmacShaKeyFor(secretKey.getBytes());

        return Jwts.builder()
                .setSubject(email)                // user identity
                .claim("role", role)              // custom claim
                .claim("name", name)              // custom claim
                .setIssuedAt(new Date())          // created now
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // 📥 Extract Email
    public String extractEmail(String token) {

        Key key = Keys.hmacShaKeyFor(secretKey.getBytes());

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    // 📥 Extract Role
    public String extractRole(String token) {

        Key key = Keys.hmacShaKeyFor(secretKey.getBytes());

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("role", String.class);
    }
    public String extractName(String token) {

        Key key = Keys.hmacShaKeyFor(secretKey.getBytes());

        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("name", String.class);
    }

    // ✅ Validate Token
    public boolean validateToken(String token) {

        try {
            Key key = Keys.hmacShaKeyFor(secretKey.getBytes());

            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);

            return true;

        } catch (Exception e) {
            return false;
        }
    }
}