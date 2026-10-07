package com.library.comms.service;

import com.library.comms.dto.UserResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class UserClientService {

    private final WebClient.Builder webClientBuilder;

    public UserClientService(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    public UserResponse getUserById(Long userId) {
        return webClientBuilder.build()
                .get()
                .uri("lb://users/api/users/{id}", userId)
                .retrieve()
                .bodyToMono(UserResponse.class)
                .block();
    }
}