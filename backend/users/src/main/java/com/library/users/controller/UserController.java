package com.library.users.controller;

import com.library.users.dto.TokenValidationRequest;
import com.library.users.dto.TokenValidationResponse;
import com.library.users.dto.AuthResponse;
import com.library.users.dto.LoginRequest;
import com.library.users.dto.RegisterRequest;
import com.library.users.dto.UserResponse;
import com.library.users.entity.User;
import com.library.users.service.AuthService;
import com.library.users.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final AuthService authService;
    private final UserService userService;

    public UserController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponse register(@Valid @RequestBody RegisterRequest request) {
        User user = userService.register(request);
        return UserResponse.from(user);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/validate")
    public TokenValidationResponse validateToken(@Valid @RequestBody TokenValidationRequest request) {
        return authService.validateToken(request);
    }

    @GetMapping("/{id}")
    public UserResponse getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return UserResponse.from(user);
    }

    @PostMapping("/refresh")
    public AuthResponse refreshToken(@Valid @RequestBody TokenValidationRequest request) {
        return authService.refreshToken(request);
    }
}