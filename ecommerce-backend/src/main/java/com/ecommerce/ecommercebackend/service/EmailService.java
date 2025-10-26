package com.ecommerce.ecommercebackend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    /**
     * Sends an email to the client.
     * This method is safe — it won't crash if mailSender isn't configured.
     */
    public void sendEmail(String to, String subject, String body) {
        try {
            if (mailSender == null) {
                System.out.println("⚠️ Email service not configured. Skipping email send.");
                return;
            }

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);

            System.out.println("✅ Email sent successfully to: " + to);
        } catch (MailException e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
        }
    }
}
