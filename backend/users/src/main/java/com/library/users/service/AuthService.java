package com.library.users.service;

import com.library.users.dto.*;
import com.library.users.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserService userService;
    private final JwtService jwtService;
    private final PhantomTokenService phantomTokenService;

    @Value("${phantom-token.expiration-ms}")
    private Long phantomTokenExpirationMs;

    public AuthService(UserService userService,
                       JwtService jwtService,
                       PhantomTokenService phantomTokenService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.phantomTokenService = phantomTokenService;
    }

    public AuthResponse login(LoginRequest request) {
        User user = userService.authenticate(request);

        String jwt = jwtService.generateToken(user);
        String opaqueToken = phantomTokenService.createOpaqueToken(jwt);

        return new AuthResponse(
                "Bearer",
                opaqueToken,
                phantomTokenExpirationMs / 1000,
                UserResponse.from(user)
        );
    }
    public TokenValidationResponse validateToken(TokenValidationRequest request) {
        return phantomTokenService.validateOpaqueToken(request.getToken())
                .map(jwt -> new TokenValidationResponse(true, jwt))
                .orElseGet(() -> new TokenValidationResponse(false, null));
    }

    public AuthResponse refreshToken(TokenValidationRequest request) {
        String currentJwt = phantomTokenService.validateOpaqueToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid token"));

        Long userId = jwtService.extractUserId(currentJwt);
        User user = userService.getUserById(userId);

        String newJwt = jwtService.generateToken(user);
        String newOpaqueToken = phantomTokenService.createOpaqueToken(newJwt);

        return new AuthResponse(
                "Bearer",
                newOpaqueToken,
                phantomTokenExpirationMs / 1000,
                UserResponse.from(user)
        );
    }
}