package com.ecommerce.ecommercebackend.payload;

import lombok.Data;

@Data
public class PasswordResetRequest {
    private String token;
    private String newPassword;
}