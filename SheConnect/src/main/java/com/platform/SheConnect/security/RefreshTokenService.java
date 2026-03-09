package com.platform.SheConnect.security;

import java.security.Key;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.platform.SheConnect.entity.RefreshToken;
import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.repository.RefreshTokenRepository;
import com.platform.SheConnect.security.JwtService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.transaction.Transactional;
import io.jsonwebtoken.SignatureAlgorithm;
import com.platform.SheConnect.entity.RefreshToken;
import io.jsonwebtoken.security.Keys;

@Service

public class RefreshTokenService {

   
    private final RefreshTokenRepository repository;
    
    private final long REFRESH_DURATION_DAYS = 7;

    public RefreshTokenService(RefreshTokenRepository repository){
        this.repository = repository;
    }

    

    public RefreshToken createRefreshToken(User user) {
        String tokenValue = UUID.randomUUID().toString();
       
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(tokenValue);
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(LocalDateTime.now().plusDays(REFRESH_DURATION_DAYS));
        return repository.save(refreshToken);


    }
    @Transactional
    public  void deleteRefreshToken(String token) {
        System.out.println("Deleting refresh token: " + token);
        repository.deleteByToken(token);
    }

    @Transactional
    public RefreshToken validateRefreshToken(String token) {
        RefreshToken refreshToken = repository.findByToken(token);
       if (refreshToken == null) {
           throw new RuntimeException("Invalid refresh token");
       }

        if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Refresh token expired");
        }

    return refreshToken;
}
    }


