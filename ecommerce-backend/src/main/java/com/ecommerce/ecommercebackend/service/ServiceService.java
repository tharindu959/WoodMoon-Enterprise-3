package com.ecommerce.ecommercebackend.service;

import com.ecommerce.ecommercebackend.payload.ServiceDTO;
import com.ecommerce.ecommercebackend.model.ServiceEntity;
import com.ecommerce.ecommercebackend.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ServiceService {

    private final ServiceRepository repo;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public ServiceService(ServiceRepository repo) {
        this.repo = repo;
    }

    // Get all
    public List<ServiceDTO> getAllServices() {
        return repo.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Create
    public ServiceDTO createService(String serviceName, String description, MultipartFile image) throws IOException {
        ServiceEntity s = new ServiceEntity();
        s.setServiceName(serviceName);
        s.setDescription(description);

        if (image != null && !image.isEmpty()) {
            s.setImagePath(saveImage(image));
        }

        return convertToDTO(repo.save(s));
    }

    // ✅ Update
    public ServiceDTO updateService(Long id, String serviceName, String description, MultipartFile image) throws IOException {
        Optional<ServiceEntity> optional = repo.findById(id);
        if (optional.isEmpty()) {
            return null;
        }

        ServiceEntity s = optional.get();
        s.setServiceName(serviceName);
        s.setDescription(description);

        if (image != null && !image.isEmpty()) {
            s.setImagePath(saveImage(image));
        }

        return convertToDTO(repo.save(s));
    }

    // ✅ Delete
    public boolean deleteService(Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return true;
        }
        return false;
    }

    // Helper: Save image to uploads/
    private String saveImage(MultipartFile image) throws IOException {
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String fileName = System.currentTimeMillis() + "-" + image.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/" + fileName; // relative path for frontend
    }

    private ServiceDTO convertToDTO(ServiceEntity entity) {
        return new ServiceDTO(
                entity.getId(),
                entity.getServiceName(),
                entity.getDescription(),
                entity.getImagePath()
        );
    }
}