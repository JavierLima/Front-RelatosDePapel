package com.library.orders.controller;

import static org.junit.jupiter.api.Assertions.*;
import com.library.orders.dto.CreateOrderRequest;
import com.library.orders.entity.Order;
import com.library.orders.repository.OrderRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureRestTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.client.RestTestClient;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureRestTestClient
@ActiveProfiles("test")
class OrderControllerTest {
    @Autowired
    private RestTestClient restTestClient;

    @Autowired
    private OrderRepository repository;

    @AfterEach
    void cleanDatabase() {
        repository.deleteAll();
    }

    @Test
    void shouldReturnEmptyListWhenUserHasNoOrders() {
        restTestClient.get()
                .uri("/api/orders/users/999/recent")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.length()").isEqualTo(0);
    }

    @Test
    void shouldGetRecentOrdersByUser() {
        repository.save(Order.builder()
                .userId(1L)
                .bookId(10L)
                .bookTitle("Clean Code")
                .quantity(2)
                .unitPrice(39.99)
                .totalPrice(79.98)
                .createdAt(LocalDateTime.now())
                .build());

        repository.save(Order.builder()
                .userId(1L)
                .bookId(20L)
                .bookTitle("Refactoring")
                .quantity(1)
                .unitPrice(50.0)
                .totalPrice(50.0)
                .createdAt(LocalDateTime.now())
                .build());

        repository.save(Order.builder()
                .userId(2L)
                .bookId(30L)
                .bookTitle("Domain-Driven Design")
                .quantity(1)
                .unitPrice(45.0)
                .totalPrice(45.0)
                .createdAt(LocalDateTime.now())
                .build());

        restTestClient.get()
                .uri("/api/orders/users/1/recent")
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.length()").isEqualTo(2)
                .jsonPath("$[0].userId").isEqualTo(1)
                .jsonPath("$[1].userId").isEqualTo(1);
    }
}