package com.ecommerce.ecommercebackend.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class WebConfig {
    // ⚠️ Removed duplicate corsConfigurer() bean
    // SecurityConfig already handles all CORS settings.
}
