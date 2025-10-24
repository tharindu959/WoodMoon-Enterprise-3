package com.ecommerce.ecommercebackend.payload;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginRequest {
    // We map this to the user's email for Spring Security
    private String username; 
    private String password;
}