package com.ecommerce.ecommercebackend.controller;

import com.ecommerce.ecommercebackend.model.Admin;
import com.ecommerce.ecommercebackend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
@RestController
@RequestMapping("/api/admins")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // ✅ GET: Fetch all admins (used by your Next.js admin dashboard)
    @GetMapping("/all")
    public ResponseEntity<List<Admin>> getAllAdmins() {
        List<Admin> admins = adminService.getAllAdmins();
        return ResponseEntity.ok(admins);
    }

    // ✅ POST: Create a new admin (used by AddAdmin form)
    @PostMapping("/create")
    public ResponseEntity<Admin> createAdmin(@RequestBody Admin admin) {
        Admin saved = adminService.saveAdmin(admin);
        return ResponseEntity.ok(saved);
    }

    // ✅ (Optional) DELETE: Remove an admin by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ GET: Fetch a single admin by ID (for Admin Details page)
@GetMapping("/{id}")
public ResponseEntity<Admin> getAdminById(@PathVariable Long id) {
    Admin admin = adminService.getAdminById(id);
    if (admin == null) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(admin);
}

}
