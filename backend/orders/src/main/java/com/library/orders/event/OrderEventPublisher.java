package com.library.orders.event;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class OrderEventPublisher {

    private final WebClient.Builder webClientBuilder;

    public OrderEventPublisher(WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    @Async
    public void publishOrderCreated(OrderCreatedEvent event) {
        webClientBuilder.build()
                .post()
                .uri("lb://comms/api/events/orders/created")
                .bodyValue(event)
                .retrieve()
                .bodyToMono(Void.class)
                .doOnError(error ->
                        System.err.println("Error publishing order created event: " + error.getMessage())
                )
                .subscribe();
    }
}
