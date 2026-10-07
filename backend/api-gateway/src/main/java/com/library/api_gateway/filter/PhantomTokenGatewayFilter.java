package com.library.api_gateway.filter;

import com.library.api_gateway.dto.TokenValidationRequest;
import com.library.api_gateway.dto.TokenValidationResponse;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Component
public class PhantomTokenGatewayFilter implements GlobalFilter, Ordered {

    private final WebClient.Builder webClientBuilder;

    public PhantomTokenGatewayFilter(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    @Override
    public Mono<Void> filter(org.springframework.web.server.ServerWebExchange exchange,
                             org.springframework.cloud.gateway.filter.GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();

        if (isPublicEndpoint(path)) {
            return chain.filter(exchange);
        }

        String authorizationHeader = exchange.getRequest()
                .getHeaders()
                .getFirst("Authorization");

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String opaqueToken = authorizationHeader.substring(7);

        return webClientBuilder.build()
                .post()
                .uri("lb://users/api/users/validate")
                .bodyValue(new TokenValidationRequest(opaqueToken))
                .retrieve()
                .bodyToMono(TokenValidationResponse.class)
                .flatMap(response -> {
                    if (response == null || !response.isValid()) {
                        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                        return exchange.getResponse().setComplete();
                    }

                    var mutatedRequest = exchange.getRequest()
                            .mutate()
                            .header("accessToken", response.getAccessToken())
                            .build();

                    return chain.filter(exchange.mutate().request(mutatedRequest).build());
                })
                .onErrorResume(error -> {
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                });
    }

    private boolean isPublicEndpoint(String path) {
        return path.startsWith("/api/users/login")
                || path.startsWith("/api/users/register")
                || path.startsWith("/api/users/refresh")
                || path.startsWith("/api/users/validate")
                || path.startsWith("/api/books")
                || path.startsWith("/ws/support");
    }

    @Override
    public int getOrder() {
        return -1;
    }
}