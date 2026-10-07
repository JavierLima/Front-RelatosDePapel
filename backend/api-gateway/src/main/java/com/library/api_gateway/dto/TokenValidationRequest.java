package com.library.api_gateway.dto;

public class TokenValidationRequest {

    private String token;

    public TokenValidationRequest() {
    }

    public TokenValidationRequest(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}