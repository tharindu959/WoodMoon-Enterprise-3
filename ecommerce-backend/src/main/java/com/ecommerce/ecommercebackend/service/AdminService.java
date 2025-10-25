package com.ecommerce.ecommercebackend.service;

import com.ecommerce.ecommercebackend.model.Admin;
import com.ecommerce.ecommercebackend.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    // ✅ Get all admins
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    // ✅ Create or update admin
    public Admin saveAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    // ✅ Get a single admin by ID
    public Admin getAdminById(Long id) {
        Optional<Admin> admin = adminRepository.findById(id);
        return admin.orElse(null);
    }

    // ✅ Delete admin safely (with error handling)
    public String deleteAdmin(Long id) {
        if (!adminRepository.existsById(id)) {
            throw new RuntimeException("Admin not found with ID: " + id);
        }
        adminRepository.deleteById(id);
        return "Admin deleted successfully!";
    }
}
