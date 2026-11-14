package com.smartride.backend.auth.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.nio.charset.StandardCharsets;
import java.util.Date;


@Service
public class JwtService {


    private final String secret =
            "SmartRideSecretKeyForDevelopmentOnlyChangeThis123456789";


    private final long expiration =
            1000 * 60 * 60;


    // ==========================================
    // SECRET KEY
    // ==========================================

    private SecretKey getKey() {

        return Keys.hmacShaKeyFor(
                secret.getBytes(
                        StandardCharsets.UTF_8
                )
        );
    }


    // ==========================================
    // GENERATE TOKEN
    // ==========================================

    public String generateToken(
            String userId,
            String role
    ) {

        return Jwts.builder()

                .subject(userId)

                .claim(
                        "role",
                        role
                )

                .issuedAt(
                        new Date()
                )

                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + expiration
                        )
                )

                .signWith(
                        getKey()
                )

                .compact();
    }


    // ==========================================
    // EXTRACT ALL CLAIMS
    // ==========================================

    public Claims extractAllClaims(
            String token
    ) {

        return Jwts.parser()

                .verifyWith(
                        getKey()
                )

                .build()

                .parseSignedClaims(
                        token
                )

                .getPayload();
    }


    // ==========================================
    // EXTRACT USER ID
    // ==========================================

    public String extractUserId(
            String token
    ) {

        return extractAllClaims(token)
                .getSubject();
    }


    // ==========================================
    // EXTRACT ROLE
    // ==========================================

    public String extractRole(
            String token
    ) {

        return extractAllClaims(token)
                .get(
                        "role",
                        String.class
                );
    }
}