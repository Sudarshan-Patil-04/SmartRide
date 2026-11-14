package com.smartride.backend.auth.security;

import com.smartride.backend.auth.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(
            JwtService jwtService
    ) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        System.out.println();
        System.out.println("==========================================");
        System.out.println("JWT FILTER");
        System.out.println(
                "Request: "
                        + request.getMethod()
                        + " "
                        + request.getRequestURI()
        );

        // ==========================================
        // GET AUTHORIZATION HEADER
        // ==========================================

        String authHeader =
                request.getHeader("Authorization");

        System.out.println(
                "Authorization Header Present: "
                        + (authHeader != null)
        );

        // ==========================================
        // NO TOKEN
        // ==========================================

        if (
                authHeader == null
                        ||
                !authHeader.startsWith("Bearer ")
        ) {

            System.out.println(
                    "❌ NO VALID BEARER TOKEN"
            );

            filterChain.doFilter(
                    request,
                    response
            );

            return;
        }

        // ==========================================
        // EXTRACT TOKEN
        // ==========================================

        String token =
                authHeader.substring(7);

        try {

            // ==========================================
            // USER ID
            // ==========================================

            String userId =
                    jwtService.extractUserId(token);

            // ==========================================
            // ROLE
            // ==========================================

            String role =
                    jwtService.extractRole(token);

            System.out.println(
                    "JWT User ID: "
                            + userId
            );

            System.out.println(
                    "JWT Role: "
                            + role
            );

            // ==========================================
            // CHECK
            // ==========================================

            if (
                    userId == null
                            ||
                    userId.trim().isEmpty()
            ) {

                System.out.println(
                        "❌ JWT USER ID IS NULL"
                );

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }

            if (
                    role == null
                            ||
                    role.trim().isEmpty()
            ) {

                System.out.println(
                        "❌ JWT ROLE IS NULL"
                );

                filterChain.doFilter(
                        request,
                        response
                );

                return;
            }

            // ==========================================
            // NORMALIZE ROLE
            // ==========================================

            String normalizedRole =
                    role.trim().toUpperCase();

            if (
                    normalizedRole.startsWith(
                            "ROLE_"
                    )
            ) {

                normalizedRole =
                        normalizedRole.substring(5);
            }

            String authority =
                    "ROLE_" + normalizedRole;

            System.out.println(
                    "Normalized Role: "
                            + normalizedRole
            );

            System.out.println(
                    "Granted Authority: "
                            + authority
            );

            // ==========================================
            // CREATE AUTHENTICATION
            // ==========================================

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userId,
                            null,
                            List.of(
                                    new SimpleGrantedAuthority(
                                            authority
                                    )
                            )
                    );

            // ==========================================
            // SET SECURITY CONTEXT
            // ==========================================

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(
                            authentication
                    );

            System.out.println(
                    "✅ AUTHENTICATION SUCCESS"
            );

            System.out.println(
                    "Authenticated User: "
                            + authentication.getName()
            );

            System.out.println(
                    "Authorities: "
                            + authentication.getAuthorities()
            );

        }
        catch (Exception e) {

            System.out.println(
                    "❌ JWT AUTHENTICATION FAILED"
            );

            System.out.println(
                    "Reason: "
                            + e.getMessage()
            );

            SecurityContextHolder
                    .clearContext();
        }

        System.out.println(
                "=========================================="
        );

        // ==========================================
        // CONTINUE
        // ==========================================

        filterChain.doFilter(
                request,
                response
        );
    }
}