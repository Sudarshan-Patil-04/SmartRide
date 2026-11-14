package com.smartride.backend.user.repository;

import com.smartride.backend.user.model.Role;
import com.smartride.backend.user.model.User;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository
        extends MongoRepository<User, String> {


    Optional<User> findByEmail(
            String email
    );


    List<User> findByRole(
            Role role
    );
}