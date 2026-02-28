package com.platform.SheConnect.repository;

import com.platform.SheConnect.entity.User;
import com.platform.SheConnect.dto.RegisterRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

}