package com.example.woodmoon1.repo;

import com.example.woodmoon1.entity.Quotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Quotationrepo extends JpaRepository<Quotation, Integer> {
}
