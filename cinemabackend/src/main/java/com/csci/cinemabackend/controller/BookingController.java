package com.csci.cinemabackend.controller;

import com.csci.cinemabackend.dto.BookingResponse;
import com.csci.cinemabackend.dto.CheckoutConfirmRequest;
import com.csci.cinemabackend.dto.SeatAvailabilityResponse;
import com.csci.cinemabackend.service.BookingService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }


    @GetMapping("/showtimes/{showtimeId}/seats")
    public ResponseEntity<?> getSeats(@PathVariable Integer showtimeId) {
        try {
            List<SeatAvailabilityResponse> seats = bookingService.getSeatAvailability(showtimeId);
            return ResponseEntity.ok(seats);
        } catch (ResponseStatusException exception) {
            return ResponseEntity.status(exception.getStatusCode()).body(
                    Map.of("message", exception.getReason()));
        }
    }


    @PostMapping("/checkout/confirm")
    public ResponseEntity<?> confirmCheckout(@RequestBody CheckoutConfirmRequest request) {
        try {
            BookingResponse booking = bookingService.confirmCheckout(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(booking);
        } catch (DataIntegrityViolationException exception) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    Map.of("message", "One or more selected seats were just taken. Please choose another seat."));
        } catch (ResponseStatusException exception) {
            return ResponseEntity.status(exception.getStatusCode()).body(
                    Map.of("message", exception.getReason()));
        }
    }


    @GetMapping("/bookings/{bookingId}")
    public ResponseEntity<?> getBooking(@PathVariable Integer bookingId) {
        try {
            return ResponseEntity.ok(bookingService.getBooking(bookingId));
        } catch (ResponseStatusException exception) {
            return ResponseEntity.status(exception.getStatusCode()).body(
                    Map.of("message", exception.getReason()));
        }
    }


    @GetMapping("/users/{userId}/bookings")
    public ResponseEntity<List<BookingResponse>> getBookingsForUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(bookingService.getBookingsForUser(userId));
    }
}
