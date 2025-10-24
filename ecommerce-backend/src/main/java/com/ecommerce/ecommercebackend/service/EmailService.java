package com.ecommerce.ecommercebackend.service;

import org.springframework.stereotype.Service;

// This service is a placeholder. You need to implement real email sending (e.g., using JavaMailSender)
// and configure mail settings in application.properties for production.

@Service
public class EmailService {

    // Placeholder method called by AuthService
    public void sendResetPasswordEmail(String toEmail, String resetUrl) {
        // --- TODO: IMPLEMENT REAL EMAIL SENDING LOGIC HERE ---
        System.out.println("================= EMAIL SENT (DEV MODE) =================");
        System.out.println("TO: " + toEmail);
        System.out.println("SUBJECT: Password Reset Request");
        System.out.println("LINK: " + resetUrl);
        System.out.println("=========================================================");
    }
}