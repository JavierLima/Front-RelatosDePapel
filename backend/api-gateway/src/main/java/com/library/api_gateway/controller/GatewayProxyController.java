package com.library.api_gateway.controller;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/gateway")
public class GatewayProxyController {

    private final WebClient.Builder webClientBuilder;

    public GatewayProxyController(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    @PostMapping("/books/search")
    public Mono<String> searchBooks(@RequestBody Map<String, Object> filters) {

        StringBuilder uri = new StringBuilder("lb://catalogue/api/books?");

        filters.forEach((key, value) -> {
            if (value != null) {
                uri.append(key)
                        .append("=")
                        .append(value)
                        .append("&");
            }
        });

        return webClientBuilder.build()
                .get()
                .uri(uri.toString())
                .retrieve()
                .bodyToMono(String.class);
    }

    @PostMapping("/orders/recent")
    public Mono<String> recentOrders(@RequestBody Map<String, Long> body) {

        Long userId = body.get("userId");

        return webClientBuilder.build()
                .get()
                .uri("lb://orders/api/orders/users/{id}/recent", userId)
                .retrieve()
                .bodyToMono(String.class);
    }
    @PostMapping("/books/create")
    public Mono<String> createBook(@RequestBody String body) {
        return webClientBuilder.build()
                .post()
                .uri("lb://catalogue/api/books")
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class);
    }
    @PostMapping("/books/patch/{id}")
    public Mono<String> patchBook(@PathVariable Long id, @RequestBody String body) {
        return webClientBuilder.build()
                .patch()
                .uri("lb://catalogue/api/books/{id}", id)
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class);
    }
    @PostMapping("/orders/create")
    public Mono<ResponseEntity<String>> createOrder(@RequestBody String body) {
        return webClientBuilder.build()
                .post()
                .uri("lb://orders/api/orders")
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .exchangeToMono(response ->
                        response.bodyToMono(String.class)
                                .defaultIfEmpty("")
                                .map(responseBody ->
                                        ResponseEntity
                                                .status(response.statusCode())
                                                .body(responseBody)
                                )
                );
    }

}
