package com.csci.cinemabackend.controller;

import com.csci.cinemabackend.dto.PaymentRequest;
import com.csci.cinemabackend.dto.PaymentResponse;
import com.csci.cinemabackend.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public ResponseEntity<?> getAllPayments() {
        try {
            List<PaymentResponse> payments =
                    paymentService.getAllPayments();

            return ResponseEntity.ok(payments);
        } catch (ResponseStatusException exception) {
            return buildErrorResponse(exception);
        }
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<?> getPaymentById(
            @PathVariable Integer paymentId
    ) {
        try {
            PaymentResponse payment =
                    paymentService.getPaymentById(paymentId);

            return ResponseEntity.ok(payment);
        } catch (ResponseStatusException exception) {
            return buildErrorResponse(exception);
        }
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getPaymentByBookingId(
            @PathVariable Integer bookingId
    ) {
        try {
            PaymentResponse payment =
                    paymentService.getPaymentByBookingId(bookingId);

            return ResponseEntity.ok(payment);
        } catch (ResponseStatusException exception) {
            return buildErrorResponse(exception);
        }
    }

    @PostMapping("/{bookingId}/pay")
    public ResponseEntity<?> pay(
            @PathVariable Integer bookingId,
            @RequestBody PaymentRequest request
    ) {
        try {
            PaymentResponse response =
                    paymentService.pay(bookingId, request);

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
            @PathVariable Integer paymentId,
            @RequestBody Map<String, String> request
    ) {
        try {
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
            @PathVariable Integer paymentId
    ) {
        try {
            paymentService.deletePayment(paymentId);

            return ResponseEntity.noContent().build();
        } catch (ResponseStatusException exception) {
            return buildErrorResponse(exception);
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
