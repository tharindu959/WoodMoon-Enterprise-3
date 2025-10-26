package com.example.woodmoon1.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Quotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String phone;
    private String quotationDetails;

    // New fields for product catalog
    private String productName;
    private String productDescription;
    private String productImageUrl;
    private Double productPrice;
    private String type; // "QUOTATION" or "PRODUCT"
}