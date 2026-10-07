package com.library.users.dto;

import com.library.users.entity.User;

public class UserResponse {

    private Long id;
    private String fullName;
    private String email;
    private String role;

    public UserResponse() {
    }

    public UserResponse(Long id, String fullName, String email, String role) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole()
        );
    }

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }
}