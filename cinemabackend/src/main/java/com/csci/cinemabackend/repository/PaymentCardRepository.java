package com.csci.cinemabackend.repository;

import com.csci.cinemabackend.model.PaymentCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Provides database operations for stored payment cards.
 */
public interface PaymentCardRepository
        extends JpaRepository<PaymentCard, Integer> {

    List<PaymentCard> findByUserUserId(Integer userId);

    Optional<PaymentCard> findByCardIdAndUserUserId(
            Integer cardId,
            Integer userId
    );

    long countByUserUserId(Integer userId);

    void deleteByCardIdAndUserUserId(
            Integer cardId,
            Integer userId
    );
}
