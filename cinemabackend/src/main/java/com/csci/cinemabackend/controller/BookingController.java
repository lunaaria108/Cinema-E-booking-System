package com.csci.cinemabackend.controller;

import com.csci.cinemabackend.dto.BookingResponse;
import com.csci.cinemabackend.dto.CheckoutConfirmRequest;
import com.csci.cinemabackend.dto.SeatAvailabilityResponse;
import com.csci.cinemabackend.model.User;
import com.csci.cinemabackend.service.AuthService;
import com.csci.cinemabackend.service.BookingService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

/**
 * Seat browsing and the reserve ("continue to payment") step of checkout.
 *
 * Every endpoint that touches a specific user's bookings verifies the
 * caller via their session token rather than trusting a client-supplied
 * user/booking id.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService bookingService;
    private final AuthService authService;

    public BookingController(BookingService bookingService, AuthService authService) {
        this.bookingService = bookingService;
        this.authService = authService;
    }

    /**
     * GET /api/showtimes/{showtimeId}/seats
     *
     * Seat availability is not user-specific, so no auth check is needed.
     */
    @GetMapping("/showtimes/{showtimeId}/seats")
    public ResponseEntity<?> getSeats(@PathVariable Integer showtimeId) {
        try {
            List<SeatAvailabilityResponse> seats = bookingService.getSeatAvailability(showtimeId);
            return ResponseEntity.ok(seats);
        } catch (ResponseStatusException exception) {
            return errorResponse(exception);
        }
    }

    /**
     * POST /api/checkout/confirm
     *
     * The booking is always created for the authenticated caller - there
     * is no client-supplied userId to spoof.
     */
    @PostMapping("/checkout/confirm")
    public ResponseEntity<?> confirmCheckout(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody CheckoutConfirmRequest request) {

        try {
            User caller = authService.requireUser(authorizationHeader);
            BookingResponse booking = bookingService.confirmCheckout(caller.getUserId(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(booking);
        } catch (DataIntegrityViolationException exception) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    Map.of("message", "One or more selected seats were just taken. Please choose another seat."));
        } catch (ResponseStatusException exception) {
            return errorResponse(exception);
        }
    }

    /**
     * GET /api/bookings/{bookingId}
     */
    @GetMapping("/bookings/{bookingId}")
    public ResponseEntity<?> getBooking(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Integer bookingId) {

        try {
            User caller = authService.requireUser(authorizationHeader);
            return ResponseEntity.ok(bookingService.getBooking(bookingId, caller));
        } catch (ResponseStatusException exception) {
            return errorResponse(exception);
        }
    }

    /**
     * GET /api/users/{userId}/bookings
     */
    @GetMapping("/users/{userId}/bookings")
    public ResponseEntity<?> getBookingsForUser(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Integer userId) {

        try {
            User caller = authService.requireUser(authorizationHeader);
            authService.requireSelfOrAdmin(caller, userId);
            return ResponseEntity.ok(bookingService.getBookingsForUser(userId));
        } catch (ResponseStatusException exception) {
            return errorResponse(exception);
        }
    }

    private ResponseEntity<?> errorResponse(ResponseStatusException exception) {
        return ResponseEntity.status(exception.getStatusCode()).body(
                Map.of("message", exception.getReason()));
    }
}
