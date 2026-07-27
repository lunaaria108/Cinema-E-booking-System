package com.csci.cinemabackend.repository;

import com.csci.cinemabackend.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    Optional<Payment> findByBookingBookingId(Integer bookingId);
}
