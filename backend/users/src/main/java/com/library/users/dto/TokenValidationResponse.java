package com.library.users.dto;

public class TokenValidationResponse {

    private boolean valid;
    private String accessToken;

    public TokenValidationResponse() {
    }

    public TokenValidationResponse(boolean valid, String accessToken) {
        this.valid = valid;
        this.accessToken = accessToken;
    }

    public boolean isValid() {
        return valid;
    }

    public String getAccessToken() {
        return accessToken;
    }
}