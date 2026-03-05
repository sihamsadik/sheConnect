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
        Long userId = user.getId();

        RefreshToken refreshToken = new RefreshToken(
                tokenValue,
                LocalDateTime.now().plusDays(REFRESH_DURATION_DAYS),
                user
                
                
        );

        return repository.save(refreshToken);


      


    }

    // public String getAccessTokenFromRefresh(String refreshToken) {
    //     return jwtService.extractAccessTokenFromRefresh(refreshToken);
    // }

    // public Long getUserIdFromRefresh(String refreshToken) {
    //     return Long.valueOf(jwtService.extractUserIdFromRefresh(refreshToken));
    // }

    // public boolean validateRefreshToken(String refreshToken) {
    //     return jwtService.validateRefreshToken(refreshToken);
    // }
}
