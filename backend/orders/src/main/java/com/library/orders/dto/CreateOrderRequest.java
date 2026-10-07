package com.library.orders.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateOrderRequest {

    private Long userId;
    private Long bookId;
    private Integer quantity;
}