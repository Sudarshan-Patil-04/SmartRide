package com.smartride.backend.auth.dto;

import com.smartride.backend.user.model.Role;
import lombok.Data;

@Data
public class RegisterRequest {

    private String name;

    private String email;

    private String phone;

    private String password;

    private Role role;
}