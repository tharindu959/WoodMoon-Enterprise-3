package com.ecommerce.ecommercebackend.repository;

import com.ecommerce.ecommercebackend.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByResetPasswordToken(String token);
}