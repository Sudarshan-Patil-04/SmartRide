package com.smartride.backend.auth.service;

import com.smartride.backend.auth.dto.AuthResponse;
import com.smartride.backend.auth.dto.LoginRequest;
import com.smartride.backend.auth.dto.RegisterRequest;
import com.smartride.backend.user.model.Role;
import com.smartride.backend.user.model.User;
import com.smartride.backend.user.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;


    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {

        this.userRepository =
                userRepository;

        this.passwordEncoder =
                passwordEncoder;

        this.jwtService =
                jwtService;
    }


    // ==========================================
    // REGISTER
    // ==========================================

    public AuthResponse register(
            RegisterRequest request
    ) {

        // Check email
        if (
                userRepository
                        .findByEmail(
                                request.getEmail()
                        )
                        .isPresent()
        ) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }


        // ======================================
        // VALIDATE ROLE
        // ======================================

        Role role = request.getRole();


        if (role == null) {

            role = Role.CUSTOMER;

        }


        // ======================================
        // SECURITY
        // ======================================
        // Public registration se ADMIN create
        // nahi hone dena.

        if (role == Role.ADMIN) {

            throw new RuntimeException(
                    "Admin registration is not allowed"
            );
        }


        // ======================================
        // CREATE USER
        // ======================================

        User user = new User();


        user.setName(
                request.getName()
        );


        user.setEmail(
                request.getEmail()
        );


        user.setPhone(
                request.getPhone()
        );


        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );


        user.setRole(
                role
        );


        // ======================================
        // SAVE
        // ======================================

        User savedUser =
                userRepository.save(user);


        // ======================================
        // JWT
        // ======================================

        String token =
                jwtService.generateToken(
                        savedUser.getId(),
                        savedUser.getRole().name()
                );


        // ======================================
        // RESPONSE
        // ======================================

        return new AuthResponse(

                token,

                savedUser.getId(),

                savedUser.getName(),

                savedUser.getRole().name()

        );
    }


    // ==========================================
    // LOGIN
    // ==========================================

    public AuthResponse login(
            LoginRequest request
    ) {

        User user =
                userRepository
                        .findByEmail(
                                request.getEmail()
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Invalid email or password"
                                )
                        );


        if (
                !passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                )
        ) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }


        String token =
                jwtService.generateToken(
                        user.getId(),
                        user.getRole().name()
                );


        return new AuthResponse(

                token,

                user.getId(),

                user.getName(),

                user.getRole().name()

        );
    }
}