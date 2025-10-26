package com.ecommerce.ecommercebackend.controller;

import com.ecommerce.ecommercebackend.payload.ServiceRequestDTO;
import com.ecommerce.ecommercebackend.service.ServiceRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@RestController
@RequestMapping("/api/requests")

public class ServiceRequestController {

    private final ServiceRequestService requestService;

    public ServiceRequestController(ServiceRequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody ServiceRequestDTO dto) {
        ServiceRequestDTO saved = requestService.createRequest(dto);
        if (saved == null) {
            return ResponseEntity.status(404).body("Service not found");
        }
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<ServiceRequestDTO> getAllRequests() {
        return requestService.getAllRequests();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRequest(@PathVariable Long id, @RequestBody ServiceRequestDTO dto) {
        ServiceRequestDTO updated = requestService.updateRequest(id, dto);
        if (updated == null) {
            return ResponseEntity.status(404).body("Request not found");
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRequest(@PathVariable Long id) {
        boolean deleted = requestService.deleteRequest(id);
        if (deleted) return ResponseEntity.ok("Request deleted successfully");
        return ResponseEntity.status(404).body("Request not found");
    }
}