package com.library.catalogue.service;

import com.library.catalogue.entity.Book;
import com.library.catalogue.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BookService {

    private final BookRepository repository;

    public BookService(BookRepository repository) {
        this.repository = repository;
    }

    public List<Book> getAllBooks() {
        return repository.findAll();
    }

    public Optional<Book> getBookById(Long id) {
        return repository.findById(id);
    }

    public Book createBook(Book book) {
        return repository.save(book);
    }

    public Book updateBook(Long id, Book updatedBook) {
        updatedBook.setId(id);
        return repository.save(updatedBook);
    }

    public void deleteBook(Long id) {
        repository.deleteById(id);
    }
    public List<Book> searchBooks(
            String title,
            String author,
            LocalDate publicationDate,
            String category,
            String isbn,
            Integer rating,
            Boolean visible
    ) {
        Specification<Book> specification = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (title != null && !title.isBlank()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("title")),
                        "%" + title.toLowerCase() + "%"
                ));
            }

            if (author != null && !author.isBlank()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("author")),
                        "%" + author.toLowerCase() + "%"
                ));
            }

            if (publicationDate != null) {
                predicates.add(criteriaBuilder.equal(root.get("publicationDate"), publicationDate));
            }

            if (category != null && !category.isBlank()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("category")),
                        "%" + category.toLowerCase() + "%"
                ));
            }

            if (isbn != null && !isbn.isBlank()) {
                predicates.add(criteriaBuilder.like(root.get("isbn"), "%" + isbn + "%"));
            }

            if (rating != null) {
                predicates.add(criteriaBuilder.equal(root.get("rating"), rating));
            }

            if (visible != null) {
                predicates.add(criteriaBuilder.equal(root.get("visible"), visible));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        return repository.findAll(specification);
    }
    public Book patchBook(Long id, Book partialBook) {
        Book existingBook = repository.findById(id).orElseThrow(() -> new RuntimeException("Book not found"));

        if (partialBook.getTitle() != null) existingBook.setTitle(partialBook.getTitle());
        if (partialBook.getAuthor() != null) existingBook.setAuthor(partialBook.getAuthor());
        if (partialBook.getPublicationDate() != null) existingBook.setPublicationDate(partialBook.getPublicationDate());
        if (partialBook.getCategory() != null) existingBook.setCategory(partialBook.getCategory());
        if (partialBook.getIsbn() != null) existingBook.setIsbn(partialBook.getIsbn());
        if (partialBook.getRating() != null) existingBook.setRating(partialBook.getRating());
        if (partialBook.getVisible() != null) existingBook.setVisible(partialBook.getVisible());
        if (partialBook.getStock() != null) existingBook.setStock(partialBook.getStock());
        if (partialBook.getPrice() != null) existingBook.setPrice(partialBook.getPrice());

        return repository.save(existingBook);
    }
}

