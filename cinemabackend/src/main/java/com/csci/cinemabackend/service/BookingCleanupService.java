package com.csci.cinemabackend.service;

import com.csci.cinemabackend.model.Booking;
import com.csci.cinemabackend.repository.BookingRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;


@Service
public class BookingCleanupService {

    private static final long PENDING_TIMEOUT_MINUTES = 15;

    private final BookingRepository bookingRepository;

    public BookingCleanupService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Scheduled(fixedRate = 60_000)
    @Transactional
    public void cancelAbandonedBookings() {
        Instant cutoff = Instant.now().minus(PENDING_TIMEOUT_MINUTES, ChronoUnit.MINUTES);

        List<Booking> abandoned = bookingRepository.findByStatusAndBookingDateBefore("Pending", cutoff);

        for (Booking booking : abandoned) {
            booking.setStatus("Cancelled");
        }

        bookingRepository.saveAll(abandoned);
    }
}
