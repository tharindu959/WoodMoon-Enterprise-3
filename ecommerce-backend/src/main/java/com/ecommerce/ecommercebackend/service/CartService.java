package com.ecommerce.ecommercebackend.service;

import com.ecommerce.ecommercebackend.model.Cart;
import com.ecommerce.ecommercebackend.model.Product;
import com.ecommerce.ecommercebackend.repository.CartRepository;
import com.ecommerce.ecommercebackend.repository.ProductRepository;
import com.ecommerce.ecommercebackend.util.SecurityUtil;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    private String getCurrentUserEmail() {
        String email = SecurityUtil.getCurrentUserEmail();
        if (email == null) {
            throw new RuntimeException("User not authenticated");
        }
        return email;
    }

    public Cart getCartForCurrentUser() {
        String email = getCurrentUserEmail();
        return cartRepository.findByUserEmail(email)
                .orElseGet(() -> cartRepository.save(new Cart(email, new ArrayList<>())));
    }

    public Cart addToCart(Long productId) {
        String email = getCurrentUserEmail();
        Cart cart = getCartForCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        cart.getProducts().add(product);
        return cartRepository.save(cart);
    }

    public Cart removeFromCart(Long productId) {
        String email = getCurrentUserEmail();
        Cart cart = getCartForCurrentUser();
        cart.getProducts().removeIf(p -> p.getId().equals(productId));
        return cartRepository.save(cart);
    }

    public void clearCart() {
        Cart cart = getCartForCurrentUser();
        cart.getProducts().clear();
        cartRepository.save(cart);
    }
}
