package com.library.catalogue.controller;
import com.library.catalogue.entity.Book;
import com.library.catalogue.repository.BookRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureRestTestClient;
import org.springframework.test.web.servlet.client.RestTestClient;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.http.*;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureRestTestClient
@ActiveProfiles("test")
class BookIntegrationTest {

    @Autowired
    private RestTestClient webTestClient;

    @Autowired
    private BookRepository repository;

    @AfterEach
    void cleanDatabase() {
        repository.deleteAll();
    }
    @Test
    void shouldReturnNotFoundWhenBookDoesNotExist() {
        webTestClient.get()
                .uri("/api/books/99999")
                .exchange()
                .expectStatus().isNotFound();
    }
    @Test
    void shouldReturnBadRequestWhenCreatingInvalidBook() {
        Book book = Book.builder()
                .title("")
                .author("")
                .isbn("")
                .rating(10)
                .stock(-1)
                .price(-5.0)
                .build();

        webTestClient.post()
                .uri("/api/books")
                .contentType(MediaType.APPLICATION_JSON)
                .body(book)
                .exchange()
                .expectStatus().isBadRequest();
    }
    @Test
    void shouldCreateAndRetrieveBook() {
        Book book = Book.builder()
                .title("Integration Test Book")
                .author("Test Author")
                .publicationDate(LocalDate.of(2024, 1, 1))
                .category("Testing")
                .isbn("TEST-ISBN-001")
                .rating(5)
                .visible(true)
                .stock(10)
                .price(19.99)
                .build();

        Book createdBook = webTestClient.post()
                .uri("/api/books")
                .body(book)
                .exchange()
                .expectStatus().is2xxSuccessful()
                .expectBody(Book.class)
                .returnResult()
                .getResponseBody();

        assertThat(createdBook).isNotNull();
        assertThat(createdBook.getId()).isNotNull();

        webTestClient.get()
                .uri("/api/books/" + createdBook.getId())
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.title").isEqualTo("Integration Test Book");
    }
    @Test
    void shouldUpdateBook() {
        Book book = repository.save(Book.builder()
                .title("Old Title")
                .author("Old Author")
                .publicationDate(LocalDate.of(2020, 1, 1))
                .category("Old")
                .isbn("TEST-ISBN-004")
                .rating(3)
                .visible(true)
                .stock(2)
                .price(10.0)
                .build());

        Book updatedBook = Book.builder()
                .title("New Title")
                .author("New Author")
                .publicationDate(LocalDate.of(2024, 1, 1))
                .category("New")
                .isbn("TEST-ISBN-004")
                .rating(5)
                .visible(false)
                .stock(20)
                .price(25.0)
                .build();

        webTestClient.put()
                .uri("/api/books/" + book.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .body(updatedBook)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.title").isEqualTo("New Title")
                .jsonPath("$.stock").isEqualTo(20)
                .jsonPath("$.visible").isEqualTo(false);
    }
    @Test
    void shouldDeleteBook() {
        Book book = repository.save(Book.builder()
                .title("Delete Test Book")
                .author("Test Author")
                .publicationDate(LocalDate.of(2024, 1, 1))
                .category("Testing")
                .isbn("TEST-ISBN-005")
                .rating(4)
                .visible(true)
                .stock(5)
                .price(12.99)
                .build());

        webTestClient.delete()
                .uri("/api/books/" + book.getId())
                .exchange()
                .expectStatus().isNoContent();

        assertThat(repository.existsById(book.getId())).isFalse();
    }
}