package com.library.orders.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookResponse {

    private Long id;
    private String title;
    private Boolean visible;
    private Integer stock;
    private Double price;
}
