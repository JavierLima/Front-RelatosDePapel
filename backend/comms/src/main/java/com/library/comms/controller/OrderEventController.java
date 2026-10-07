package com.library.comms.controller;

import com.library.comms.dto.UserResponse;
import com.library.comms.event.OrderCreatedEvent;
import com.library.comms.service.EmailService;
import com.library.comms.service.UserClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/events/orders")
public class OrderEventController {

    private final EmailService emailService;
    private final UserClientService userClientService;

    public OrderEventController(EmailService emailService,
                                UserClientService userClientService) {
        this.emailService = emailService;
        this.userClientService = userClientService;
    }

    @PostMapping("/created")
    public ResponseEntity<Void> onOrderCreated(@RequestBody OrderCreatedEvent event) {

        System.out.println("ORDER_CREATED event received:");
        System.out.println("Order ID: " + event.getOrderId());
        System.out.println("User ID: " + event.getUserId());
        System.out.println("Book: " + event.getBookTitle());
        System.out.println("Total price: " + event.getTotalPrice());

        UserResponse user = userClientService.getUserById(event.getUserId());

        emailService.sendOrderAcceptedEmail(
                user.getEmail(),
                event
        );

        return ResponseEntity.accepted().build();
    }
}