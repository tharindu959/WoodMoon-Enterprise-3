package com.ecommerce.ecommercebackend.controller;

import com.ecommerce.ecommercebackend.model.Cart;
import com.ecommerce.ecommercebackend.service.CartService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public Cart getCart() {
        return cartService.getCartForCurrentUser();
    }

    @PostMapping("/add/{productId}")
    public Cart addToCart(@PathVariable Long productId) {
        return cartService.addToCart(productId);
    }

    @DeleteMapping("/remove/{productId}")
    public Cart removeFromCart(@PathVariable Long productId) {
        return cartService.removeFromCart(productId);
    }

    @DeleteMapping("/clear")
    public void clearCart() {
        cartService.clearCart();
    }
}
