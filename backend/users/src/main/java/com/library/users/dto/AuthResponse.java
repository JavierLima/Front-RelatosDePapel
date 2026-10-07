package com.library.users.dto;

public class AuthResponse {

    private String tokenType;
    private String accessToken;
    private Long expiresIn;
    private UserResponse user;

    public AuthResponse() {
    }

    public AuthResponse(String tokenType, String accessToken, Long expiresIn, UserResponse user) {
        this.tokenType = tokenType;
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
        this.user = user;
    }

    public String getTokenType() {
        return tokenType;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public Long getExpiresIn() {
        return expiresIn;
    }

    public UserResponse getUser() {
        return user;
    }
}