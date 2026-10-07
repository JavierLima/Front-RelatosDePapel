package com.library.catalogue.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "books")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {

    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    private String author;

    @NotNull
    private LocalDate publicationDate;

    @NotNull
    private String category;

    @NotBlank
    private String isbn;

    @Min(1)
    @Max(5)
    private Integer rating;

    @NotNull
    private Boolean visible;

    @Min(0)
    private Integer stock;

    @DecimalMin(value = "0.0", inclusive = false)
    private Double price;

}
