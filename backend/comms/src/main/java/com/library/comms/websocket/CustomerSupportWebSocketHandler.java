package com.library.comms.websocket;

import com.library.comms.service.GeminiService;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class CustomerSupportWebSocketHandler extends TextWebSocketHandler {

    private final GeminiService geminiService;

    public CustomerSupportWebSocketHandler(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        session.sendMessage(new TextMessage(
                "Hola, soy el asistente de atención al cliente de Relatos de Papel. ¿En qué puedo ayudarte?"
        ));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String userMessage = message.getPayload();

        String response = geminiService.ask(userMessage);

        session.sendMessage(new TextMessage(response));
    }
}