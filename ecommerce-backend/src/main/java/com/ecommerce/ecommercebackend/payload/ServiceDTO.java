package com.ecommerce.ecommercebackend.payload;

public class ServiceDTO {
    private Long id;
    private String serviceName;
    private String description;
    private String imagePath;

    public ServiceDTO() {}

    public ServiceDTO(Long id, String serviceName, String description, String imagePath) {
        this.id = id;
        this.serviceName = serviceName;
        this.description = description;
        this.imagePath = imagePath;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }
}