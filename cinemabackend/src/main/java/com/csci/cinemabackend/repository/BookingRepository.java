package com.csci.cinemabackend.repository;

import com.csci.cinemabackend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

    List<Booking> findByUserUserId(Integer userId);

    List<Booking> findByStatusAndBookingDateBefore(String status, Instant cutoff);
}
