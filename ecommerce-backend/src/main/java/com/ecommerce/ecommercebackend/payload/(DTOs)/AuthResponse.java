package com.ecommerce.ecommercebackend.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String message; 

    // Constructor for successful login/register (returns only token)
    public AuthResponse(String token) {
        this.token = token;
        this.message = null; // Ensure message is null for a clean success response
    }

    // Constructor for error responses (returns only message)
    public AuthResponse(String message, boolean isError) {
        this.message = message;
        this.token = null;
    }
}