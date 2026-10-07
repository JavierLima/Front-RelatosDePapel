package com.library.comms.service;

import com.library.comms.event.OrderCreatedEvent;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOrderAcceptedEmail(String userEmail, OrderCreatedEvent event) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(userEmail);
        message.setSubject("Pedido aceptado - Relatos de Papel");
        message.setText(
                "Hola,\n\n" +
                        "Tu pedido ha sido aceptado correctamente.\n\n" +
                        "Detalles del pedido:\n" +
                        "Pedido: #" + event.getOrderId() + "\n" +
                        "Libro: " + event.getBookTitle() + "\n" +
                        "Cantidad: " + event.getQuantity() + "\n" +
                        "Total: " + event.getTotalPrice() + " €\n\n" +
                        "Gracias por comprar en Relatos de Papel."
        );

        mailSender.send(message);
    }
}