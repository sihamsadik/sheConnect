package com.platform.SheConnect.repository;

import com.platform.SheConnect.entity.EntrepreneurNeed;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EntrepreneurNeedRepository extends JpaRepository<EntrepreneurNeed, Long> {
    Optional<EntrepreneurNeed> findByName(String name);

}
