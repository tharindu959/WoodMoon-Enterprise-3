package com.example.woodmoon1.service;

import com.example.woodmoon1.dto.QuotationDTO;
import com.example.woodmoon1.entity.Quotation;
import com.example.woodmoon1.repo.Quotationrepo;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuotationService {

    @Autowired
    private Quotationrepo quotationrepo;

    @Autowired
    private ModelMapper modelMapper;

    // Save quotation (for customer inquiries)
    public QuotationDTO saveQuotation(QuotationDTO dto) {
        Quotation quotation = modelMapper.map(dto, Quotation.class);
        quotation.setType("QUOTATION"); // Set type as quotation
        Quotation saved = quotationrepo.save(quotation);
        return modelMapper.map(saved, QuotationDTO.class);
    }

    // Save product (for product catalog)
    public QuotationDTO saveProduct(QuotationDTO dto) {
        Quotation quotation = modelMapper.map(dto, Quotation.class);
        quotation.setType("PRODUCT"); // Set type as product
        Quotation saved = quotationrepo.save(quotation);
        return modelMapper.map(saved, QuotationDTO.class);
    }

    // Fetch all quotations (for admin - customer inquiries)
    public List<QuotationDTO> getAllQuotations() {
        return quotationrepo.findAll().stream()
                .filter(q -> "QUOTATION".equals(q.getType()))
                .map(q -> modelMapper.map(q, QuotationDTO.class))
                .collect(Collectors.toList());
    }

    // Fetch all products (for product catalog)
    public List<QuotationDTO> getAllProducts() {
        return quotationrepo.findAll().stream()
                .filter(q -> "PRODUCT".equals(q.getType()))
                .map(q -> modelMapper.map(q, QuotationDTO.class))
                .collect(Collectors.toList());
    }

    // Delete quotation/product by ID
    public boolean deleteQuotation(Integer id) {
        if (quotationrepo.existsById(id)) {
            quotationrepo.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    // Get product by ID
    public QuotationDTO getProductById(Integer id) {
        Quotation quotation = quotationrepo.findById(id).orElse(null);
        return (quotation != null && "PRODUCT".equals(quotation.getType())) ?
                modelMapper.map(quotation, QuotationDTO.class) : null;
    }
}