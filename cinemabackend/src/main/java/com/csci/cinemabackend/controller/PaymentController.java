package com.csci.cinemabackend.controller;

import com.csci.cinemabackend.dto.PaymentRequest;
import com.csci.cinemabackend.dto.PaymentResponse;
import com.csci.cinemabackend.model.User;
import com.csci.cinemabackend.service.AuthService;
import com.csci.cinemabackend.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

/**
 * Mock payment gateway. Every endpoint verifies the caller via their
 * session token: paying/viewing is restricted to the booking's owner (or
 * an admin), and the admin-only management endpoints require admin.
 */
@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;
    private final AuthService authService;

    public PaymentController(PaymentService paymentService, AuthService authService) {
        this.paymentService = paymentService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<?> getAllPayments(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        try {
            User caller = authService.requireUser(authorizationHeader);
            requireAdmin(caller);

            List<PaymentResponse> payments =
                    paymentService.getAllPayments();

            return ResponseEntity.ok(payments);
        } catch (ResponseStatusException exception) {
            return buildErrorResponse(exception);
        }
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<?> getPaymentById(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Integer paymentId
    ) {
        try {
            User caller = authService.requireUser(authorizationHeader);

            PaymentResponse payment =
                    paymentService.getPaymentById(paymentId, caller);

            return ResponseEntity.ok(payment);
        } catch (ResponseStatusException exception) {
            return buildErrorResponse(exception);
        }
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getPaymentByBookingId(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Integer bookingId
    ) {
        try {
            User caller = authService.requireUser(authorizationHeader);

            PaymentResponse payment =
                    paymentService.getPaymentByBookingId(bookingId, caller);

            return ResponseEntity.ok(payment);
        } catch (ResponseStatusException exception) {
            return buildErrorResponse(exception);
        }
    }

    @PostMapping("/{bookingId}/pay")
    public ResponseEntity<?> pay(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Integer bookingId,
            @RequestBody PaymentRequest request
    ) {
        try {
            User caller = authService.requireUser(authorizationHeader);

            PaymentResponse response =
                    paymentService.pay(bookingId, request, caller);

            HttpStatus status =
                    "Approved".equals(response.getPaymentStatus())
                            ? HttpStatus.OK
                            : HttpStatus.PAYMENT_REQUIRED;

            return ResponseEntity
                    .status(status)
                    .body(response);
        } catch (ResponseStatusException exception) {
            return buildErrorResponse(exception);
        }
    }

    @PutMapping("/{paymentId}/status")
    public ResponseEntity<?> updatePaymentStatus(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Integer paymentId,
            @RequestBody Map<String, String> request
    ) {
        try {
            User caller = authService.requireUser(authorizationHeader);
            requireAdmin(caller);

            PaymentResponse payment =
                    paymentService.updatePaymentStatus(
                            paymentId,
                            request.get("paymentStatus")
                    );

            return ResponseEntity.ok(payment);
        } catch (ResponseStatusException exception) {
            return buildErrorResponse(exception);
        }
    }

    @DeleteMapping("/{paymentId}")
    public ResponseEntity<?> deletePayment(
            @RequestHeader("Authorization") String authorizationHeader,
            @PathVariable Integer paymentId
    ) {
        try {
            User caller = authService.requireUser(authorizationHeader);
            requireAdmin(caller);

            paymentService.deletePayment(paymentId);

            return ResponseEntity.noContent().build();
        } catch (ResponseStatusException exception) {
            return buildErrorResponse(exception);
        }
    }

    private void requireAdmin(User caller) {
        if (!Boolean.TRUE.equals(caller.getIsAdmin())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Admin access required"
            );
        }
    }

    private ResponseEntity<Map<String, String>> buildErrorResponse(
            ResponseStatusException exception
    ) {
        String message = exception.getReason() != null
                ? exception.getReason()
                : "Payment request failed";

        return ResponseEntity
                .status(exception.getStatusCode())
                .body(Map.of("message", message));
    }
}
