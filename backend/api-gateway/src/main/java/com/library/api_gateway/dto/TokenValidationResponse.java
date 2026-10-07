package com.library.api_gateway.dto;

public class TokenValidationResponse {

    private boolean valid;
    private String accessToken;

    public TokenValidationResponse() {
    }

    public boolean isValid() {
        return valid;
    }

    public String getAccessToken() {
        return accessToken;
    }
}