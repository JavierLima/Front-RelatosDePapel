package com.library.orders.service;

import com.library.orders.dto.BookResponse;
import com.library.orders.dto.CreateOrderRequest;
import com.library.orders.entity.Order;
import com.library.orders.event.OrderCreatedEvent;
import com.library.orders.event.OrderEventPublisher;
import com.library.orders.exception.InsufficientStockException;
import com.library.orders.repository.OrderRepository;
import com.library.orders.exception.BookHiddenException;
import com.library.orders.exception.BookNotFoundException;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {
    private final OrderEventPublisher orderEventPublisher;
    private final OrderRepository repository;
    private final WebClient.Builder webClientBuilder;
    private final JwtService jwtService;

    public OrderService(OrderRepository repository,
                        WebClient.Builder webClientBuilder,
                        OrderEventPublisher orderEventPublisher,
                        JwtService jwtService) {
        this.repository = repository;
        this.webClientBuilder = webClientBuilder;
        this.orderEventPublisher = orderEventPublisher;
        this.jwtService = jwtService;
    }
    public Order createOrder(CreateOrderRequest request, String accessToken) {

        Long authenticatedUserId = jwtService.extractUserId(accessToken);

        BookResponse book = webClientBuilder.build()
                .get()
                .uri("lb://catalogue/api/books/{id}", request.getBookId())
                .retrieve()
                .onStatus(
                        HttpStatusCode::is4xxClientError,
                        response -> Mono.error(new BookNotFoundException("Book not found"))
                )
                .bodyToMono(BookResponse.class)
                .block();

        if (book == null) {
            throw new BookNotFoundException("Book not found");
        }

        if (!Boolean.TRUE.equals(book.getVisible())) {
            throw new BookHiddenException("Book is hidden");
        }

        if (book.getStock() == null || book.getStock() < request.getQuantity()) {
            throw new InsufficientStockException("Not enough stock");
        }

        Integer newStock = book.getStock() - request.getQuantity();

        webClientBuilder.build()
                .patch()
                .uri("lb://catalogue/api/books/{id}", book.getId())
                .bodyValue(Map.of("stock", newStock))
                .retrieve()
                .bodyToMono(Void.class)
                .block();

        Order order = Order.builder()
                .userId(authenticatedUserId)
                .bookId(book.getId())
                .bookTitle(book.getTitle())
                .quantity(request.getQuantity())
                .unitPrice(book.getPrice())
                .totalPrice(book.getPrice() * request.getQuantity())
                .createdAt(LocalDateTime.now())
                .build();

        Order savedOrder = repository.save(order);

        orderEventPublisher.publishOrderCreated(
                new OrderCreatedEvent(
                        savedOrder.getId(),
                        savedOrder.getUserId(),
                        savedOrder.getBookId(),
                        savedOrder.getBookTitle(),
                        savedOrder.getQuantity(),
                        savedOrder.getTotalPrice(),
                        savedOrder.getCreatedAt()
                )
        );

        return savedOrder;
    }

    public List<Order> getRecentOrdersByAuthenticatedUser(String accessToken) {
        Long authenticatedUserId = jwtService.extractUserId(accessToken);
        return repository.findTop10ByUserIdOrderByCreatedAtDesc(authenticatedUserId);
    }
}