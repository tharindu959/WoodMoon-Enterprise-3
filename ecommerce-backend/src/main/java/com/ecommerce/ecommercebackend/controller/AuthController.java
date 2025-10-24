package com.ecommerce.ecommercebackend.controller;

import com.ecommerce.ecommercebackend.model.User;
import com.ecommerce.ecommercebackend.payload.RegisterRequest;
import com.ecommerce.ecommercebackend.repository.UserRepository;
import com.ecommerce.ecommercebackend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthService authService;

    // Create a new admin
    @PostMapping("/create")
    public ResponseEntity<?> createAdmin(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email already exists.");
        }

        User admin = new User();
        admin.setEmail(request.getEmail());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setFirstName(request.getFirstName());
        admin.setLastName(request.getLastName());
        admin.setAddress(request.getAddress());
        admin.setPhone(request.getPhone());
        // You can add a "role" field if you want to distinguish admins
        // admin.setRole("ADMIN");

        userRepository.save(admin);
        return ResponseEntity.status(HttpStatus.CREATED).body(admin);
    }

    // Delete a user by ID
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }

        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully.");
    }
}