package com.example.woodmoon1.controller;

import com.example.woodmoon1.dto.QuotationDTO;
import com.example.woodmoon1.service.QuotationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class QuotationController {

    @Autowired
    private QuotationService quotationService;

    // ✅ Save new quotation (customer inquiry)
    @PostMapping("/quotations")
    public QuotationDTO saveQuotation(@RequestBody QuotationDTO quotationDTO) {
        return quotationService.saveQuotation(quotationDTO);
    }

    // ✅ Save new product (for catalog)
    @PostMapping("/products")
    public QuotationDTO saveProduct(@RequestBody QuotationDTO productDTO) {
        return quotationService.saveProduct(productDTO);
    }

    // ✅ Get all quotations (customer inquiries for admin)
    @GetMapping("/quotations")
    public List<QuotationDTO> getAllQuotations() {
        return quotationService.getAllQuotations();
    }

    // ✅ Get all products (for catalog frontend)
    @GetMapping("/products")
    public List<QuotationDTO> getAllProducts() {
        return quotationService.getAllProducts();
    }

    // ✅ Get product by ID
    @GetMapping("/products/{id}")
    public QuotationDTO getProductById(@PathVariable Integer id) {
        return quotationService.getProductById(id);
    }

    // ✅ Delete quotation/product by ID
    @DeleteMapping("/{id}")
    public String deleteQuotation(@PathVariable Integer id) {
        boolean deleted = quotationService.deleteQuotation(id);
        return deleted ? "Item deleted successfully" : "Item not found";
    }
}