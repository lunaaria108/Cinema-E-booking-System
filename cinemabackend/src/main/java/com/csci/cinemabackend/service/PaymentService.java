package com.csci.cinemabackend.service;

import com.csci.cinemabackend.dto.PaymentRequest;
import com.csci.cinemabackend.dto.PaymentResponse;
import com.csci.cinemabackend.model.Booking;
import com.csci.cinemabackend.model.Payment;
import com.csci.cinemabackend.model.PaymentCard;
import com.csci.cinemabackend.repository.BookingRepository;
import com.csci.cinemabackend.repository.PaymentCardRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;


@Service
public class PaymentService {

    private final BookingRepository bookingRepository;
    private final PaymentCardRepository paymentCardRepository;
    private final BookingFinalizationService bookingFinalizationService;

    public PaymentService(
            BookingRepository bookingRepository,
            PaymentCardRepository paymentCardRepository,
            BookingFinalizationService bookingFinalizationService) {

        this.bookingRepository = bookingRepository;
        this.paymentCardRepository = paymentCardRepository;
        this.bookingFinalizationService = bookingFinalizationService;
    }

    public PaymentResponse pay(Integer bookingId, PaymentRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        if (!"Pending".equals(booking.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Booking is not awaiting payment (status: " + booking.getStatus() + ")");
        }

        PaymentCard savedCard = null;
        String cardNumberForMockCheck;
        String cvvForMockCheck = request.getCvv();

        if (request.getCardId() != null) {
            savedCard = paymentCardRepository.findByCardIdAndUserUserId(
                            request.getCardId(), booking.getUser().getUserId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Payment card not found for this user"));

            cardNumberForMockCheck = "**** " + savedCard.getLastFour();
        } else {
            requiredText(request.getCardholderName(), "Cardholder name is required");
            String cardNumber = requiredText(request.getCardNumber(), "Card number is required");

            if (!cardNumber.replaceAll("\\s", "").matches("\\d{13,19}")) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Card number must contain between 13 and 19 digits");
            }

            requiredText(cvvForMockCheck, "CVV is required");

            cardNumberForMockCheck = cardNumber;
        }

        //call the gateway. No DB transaction/locks held here.
        boolean approved = mockGatewayCharge(cardNumberForMockCheck, cvvForMockCheck);
        String paymentReference = UUID.randomUUID().toString();

        // short transaction after the gateway responds.
        Payment payment = bookingFinalizationService.finalize(bookingId, approved, savedCard, paymentReference);

        return new PaymentResponse(payment);
    }

    private boolean mockGatewayCharge(String cardNumber, String cvv) {
        String digitsOnly = cardNumber.replaceAll("\\D", "");

        if (digitsOnly.endsWith("0000")) {
            return false;
        }

        return !"000".equals(cvv);
    }

    private String requiredText(String value, String errorMessage) {
        if (value == null || value.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, errorMessage);
        }

        return value.trim();
    }
}
