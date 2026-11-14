package com.smartride.backend.config;

import com.smartride.backend.user.model.Role;
import com.smartride.backend.user.model.User;
import com.smartride.backend.user.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {

        return args -> {

            // ==========================================
            // CHECK IF ADMIN ALREADY EXISTS
            // ==========================================

            boolean adminExists =
                    userRepository
                            .findByEmail(
                                    "admin@smartride.com"
                            )
                            .isPresent();


            // ==========================================
            // CREATE ADMIN
            // ==========================================

            if (!adminExists) {

                User admin = new User();

                admin.setName(
                        "SmartRide Admin"
                );

                admin.setEmail(
                        "admin@smartride.com"
                );

                admin.setPhone(
                        "9999999999"
                );

                admin.setPassword(
                        passwordEncoder.encode(
                                "Admin@123"
                        )
                );

                admin.setRole(
                        Role.ADMIN
                );


                userRepository.save(admin);


                System.out.println(
                        "================================="
                );

                System.out.println(
                        "SmartRide Admin Created"
                );

                System.out.println(
                        "Email: admin@smartride.com"
                );

                System.out.println(
                        "Password: Admin@123"
                );

                System.out.println(
                        "================================="
                );

            }

        };

    }

}