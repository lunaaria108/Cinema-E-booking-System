package com.csci.cinemabackend.controller;

import com.csci.cinemabackend.dto.PaymentRequest;
import com.csci.cinemabackend.dto.PaymentResponse;
import com.csci.cinemabackend.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;


@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    
    @PostMapping("/{bookingId}/pay")
    public ResponseEntity<?> pay(
            @PathVariable Integer bookingId,
            @RequestBody PaymentRequest request) {

        try {
            PaymentResponse response = paymentService.pay(bookingId, request);

            HttpStatus status = "Approved".equals(response.getPaymentStatus())
                    ? HttpStatus.OK
                    : HttpStatus.PAYMENT_REQUIRED;

            return ResponseEntity.status(status).body(response);
        } catch (ResponseStatusException exception) {
            return ResponseEntity.status(exception.getStatusCode()).body(
                    Map.of("message", exception.getReason()));
        }
    }
}
