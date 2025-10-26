package com.example.woodmoon1.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuotationDTO {
    private int id;
    private String name;
    private String phone;
    private String quotationDetails;

    // New fields for product catalog
    private String productName;
    private String productDescription;
    private String productImageUrl;
    private Double productPrice;
    private String type;
}