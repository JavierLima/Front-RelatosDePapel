package com.library.users.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

@Service
public class PhantomTokenService {

    private static final String TOKEN_PREFIX = "phantom-token:";

    private final StringRedisTemplate redisTemplate;

    @Value("${phantom-token.expiration-ms}")
    private Long phantomTokenExpirationMs;

    public PhantomTokenService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public String createOpaqueToken(String jwt) {
        String opaqueToken = UUID.randomUUID().toString();

        redisTemplate.opsForValue().set(
                TOKEN_PREFIX + opaqueToken,
                jwt,
                Duration.ofMillis(phantomTokenExpirationMs)
        );

        return opaqueToken;
    }

    public Optional<String> validateOpaqueToken(String opaqueToken) {
        String jwt = redisTemplate.opsForValue().get(TOKEN_PREFIX + opaqueToken);

        if (jwt == null) {
            return Optional.empty();
        }

        return Optional.of(jwt);
    }
}