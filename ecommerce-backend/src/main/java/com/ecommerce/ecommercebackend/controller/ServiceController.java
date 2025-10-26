package com.ecommerce.ecommercebackend.controller;

import com.ecommerce.ecommercebackend.payload.ServiceDTO;
import com.ecommerce.ecommercebackend.service.ServiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@RestController
@RequestMapping("/api/services")
public class ServiceController {


//@CrossOrigin(origins = "http://localhost:8080")
//public class ServiceController {

    private final ServiceService service;

    public ServiceController(ServiceService service) {
        this.service = service;
    }

    @GetMapping
    public List<ServiceDTO> getAll() {
        return service.getAllServices();
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createService(
            @RequestParam("serviceName") String serviceName,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            ServiceDTO createdService = service.createService(serviceName, description, image);
            return ResponseEntity.ok(createdService);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error saving file: " + e.getMessage());
        }
    }

    // ✅ Update Service
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateService(
            @PathVariable Long id,
            @RequestParam("serviceName") String serviceName,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            ServiceDTO updated = service.updateService(id, serviceName, description, image);
            if (updated == null) {
                return ResponseEntity.status(404).body("Service not found");
            }
            return ResponseEntity.ok(updated);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error updating file: " + e.getMessage());
        }
    }

    // ✅ Delete Service
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        boolean deleted = service.deleteService(id);
        if (deleted) {
            return ResponseEntity.ok("Service deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Service not found");
        }
    }
}