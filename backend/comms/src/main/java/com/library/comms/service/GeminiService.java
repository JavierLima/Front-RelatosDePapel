package com.library.comms.service;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.List;
import java.util.Map;
@Service
public class GeminiService {

    private final WebClient.Builder webClientBuilder;


    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    public GeminiService(@Qualifier("externalWebClientBuilder") WebClient.Builder webClientBuilder) {
        this.webClientBuilder = webClientBuilder;
    }

    public String ask(String userMessage) {
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "role", "user",
                                "parts", List.of(
                                        Map.of("text", buildPrompt(userMessage))
                                )
                        )
                )
        );

        try {
            Map response = webClientBuilder
                    .baseUrl(apiUrl)
                    .build()
                    .post()
                    .uri(uriBuilder -> uriBuilder
                            .queryParam("key", apiKey)
                            .build()
                    )
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .retryWhen(
                            Retry.backoff(3, Duration.ofSeconds(2))
                                    .filter(throwable ->
                                            throwable instanceof WebClientResponseException e
                                                    && e.getStatusCode().is5xxServerError()
                                    )
                    )
                    .block();

            return extractText(response);

        } catch (WebClientResponseException e) {
            System.err.println("Error HTTP Gemini: " + e.getStatusCode());
            System.err.println("Respuesta Gemini: " + e.getResponseBodyAsString());

            return "Ahora mismo no puedo conectar con el asistente de IA. Inténtalo de nuevo más tarde.";

        } catch (Exception e) {
            e.printStackTrace();
            return "Ahora mismo no puedo conectar con el asistente de IA. Inténtalo de nuevo más tarde.";
        }
    }

    private String buildPrompt(String userMessage) {
        return """
                Eres un agente de atención al cliente de una tienda online de libros llamada Relatos de Papel.

                Debes responder en español, de forma breve, amable y útil.

                Información general:
                - La tienda vende libros físicos.
                - Los clientes pueden consultar el catálogo, añadir libros al carrito y realizar pedidos.
                - Tras crear un pedido, el sistema envía un correo de confirmación.
                - Si el usuario pregunta por disponibilidad, indica que debe consultar el catálogo actualizado.
                - Si pregunta por pedidos concretos, indícale que revise su perfil o historial de pedidos.

                Mensaje del cliente:
                %s
                """.formatted(userMessage);
    }

    private String extractText(Map response) {
        if (response == null) {
            return "No he podido generar una respuesta.";
        }

        try {
            List candidates = (List) response.get("candidates");

            if (candidates == null || candidates.isEmpty()) {
                return "No he recibido ninguna respuesta del asistente.";
            }

            Map firstCandidate = (Map) candidates.get(0);
            Map content = (Map) firstCandidate.get("content");
            List parts = (List) content.get("parts");

            if (parts == null || parts.isEmpty()) {
                return "La respuesta del asistente no contiene texto.";
            }

            Map firstPart = (Map) parts.get(0);
            Object text = firstPart.get("text");

            return text != null ? text.toString() : "El asistente no devolvió texto.";

        } catch (Exception e) {
            e.printStackTrace();
            return "No he podido interpretar la respuesta del asistente.";
        }
    }
}