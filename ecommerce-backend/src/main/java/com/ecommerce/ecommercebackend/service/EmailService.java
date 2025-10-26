package com.ecommerce.ecommercebackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public void sendServiceRequestEmail(String userName, String userEmail, String message, String serviceName) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(senderEmail);
        mail.setTo(senderEmail); // You receive it
        mail.setSubject("New Service Request from " + userName);
        mail.setText(
                "You have received a new service request.\n\n" +
                        "User Name: " + userName + "\n" +
                        "User Email: " + userEmail + "\n" +
                        "Service: " + serviceName + "\n" +
                        "Message:\n" + message
        );
        mailSender.send(mail);
    }
}