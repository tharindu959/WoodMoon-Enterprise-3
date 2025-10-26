package com.ecommerce.ecommercebackend.repository;

import com.ecommerce.ecommercebackend.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
    // ✅ You can add custom queries later if needed
}
