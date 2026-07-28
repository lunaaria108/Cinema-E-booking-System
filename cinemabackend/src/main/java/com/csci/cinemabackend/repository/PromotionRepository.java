package com.csci.cinemabackend.repository;

import com.csci.cinemabackend.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Provides database operations for promotions.
 */
@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Integer> {
}
