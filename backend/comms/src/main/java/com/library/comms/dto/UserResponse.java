package com.library.comms.dto;

public class UserResponse {

    private Long id;
    private String fullName;
    private String email;
    private String role;

    public UserResponse() {
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