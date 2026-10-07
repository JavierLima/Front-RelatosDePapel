package com.library.orders.repository;

import com.library.orders.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findTop10ByUserIdOrderByCreatedAtDesc(Long userId);
}