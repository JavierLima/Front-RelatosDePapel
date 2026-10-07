package com.library.comms.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import com.library.comms.websocket.CustomerSupportWebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final CustomerSupportWebSocketHandler customerSupportWebSocketHandler;

    public WebSocketConfig(CustomerSupportWebSocketHandler customerSupportWebSocketHandler) {
        this.customerSupportWebSocketHandler = customerSupportWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(customerSupportWebSocketHandler, "/ws/support")
                .setAllowedOrigins("*");
    }
}