package com.ecommerce.ecommercebackend.service;

import com.ecommerce.ecommercebackend.payload.ServiceRequestDTO;
import com.ecommerce.ecommercebackend.model.ServiceEntity;
import com.ecommerce.ecommercebackend.model.ServiceRequestEntity;
import com.ecommerce.ecommercebackend.repository.ServiceRepository;
import com.ecommerce.ecommercebackend.repository.ServiceRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ServiceRequestService {

    private final ServiceRequestRepository requestRepo;
    private final ServiceRepository serviceRepo;
    private final EmailService emailService;

    public ServiceRequestService(ServiceRequestRepository requestRepo, ServiceRepository serviceRepo, EmailService emailService) {
        this.requestRepo = requestRepo;
        this.serviceRepo = serviceRepo;
        this.emailService = emailService;
    }

    // Create new request
    public ServiceRequestDTO createRequest(ServiceRequestDTO dto) {
        Optional<ServiceEntity> serviceOpt = serviceRepo.findById(dto.getServiceId());
        if (serviceOpt.isEmpty()) return null;

        ServiceEntity service = serviceOpt.get();

        ServiceRequestEntity entity = new ServiceRequestEntity();
        entity.setUserName(dto.getUserName());
        entity.setUserEmail(dto.getUserEmail());
        entity.setMessage(dto.getMessage());
        entity.setService(service);

        ServiceRequestEntity saved = requestRepo.save(entity);

        // Send email notification
        emailService.sendServiceRequestEmail(
                dto.getUserName(),
                dto.getUserEmail(),
                dto.getMessage(),
                service.getServiceName()
        );

        return convertToDTO(saved);
    }

    // Get all
    public List<ServiceRequestDTO> getAllRequests() {
        return requestRepo.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Update
    public ServiceRequestDTO updateRequest(Long id, ServiceRequestDTO dto) {
        Optional<ServiceRequestEntity> optional = requestRepo.findById(id);
        if (optional.isEmpty()) return null;

        ServiceRequestEntity entity = optional.get();
        entity.setUserName(dto.getUserName());
        entity.setUserEmail(dto.getUserEmail());
        entity.setMessage(dto.getMessage());

        if (dto.getServiceId() != null) {
            serviceRepo.findById(dto.getServiceId()).ifPresent(entity::setService);
        }

        return convertToDTO(requestRepo.save(entity));
    }

    // Delete
    public boolean deleteRequest(Long id) {
        if (requestRepo.existsById(id)) {
            requestRepo.deleteById(id);
            return true;
        }
        return false;
    }

    private ServiceRequestDTO convertToDTO(ServiceRequestEntity entity) {
        ServiceRequestDTO dto = new ServiceRequestDTO();
        dto.setId(entity.getId());
        dto.setUserName(entity.getUserName());
        dto.setUserEmail(entity.getUserEmail());
        dto.setMessage(entity.getMessage());
        dto.setServiceId(entity.getService().getId());
        dto.setServiceName(entity.getService().getServiceName());
        return dto;
    }
}