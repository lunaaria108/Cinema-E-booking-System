package com.csci.cinemabackend.service;

import com.csci.cinemabackend.dto.PaymentRequest;
import com.csci.cinemabackend.dto.PaymentResponse;
import com.csci.cinemabackend.model.Booking;
import com.csci.cinemabackend.model.Payment;
import com.csci.cinemabackend.model.PaymentCard;
import com.csci.cinemabackend.model.User;
import com.csci.cinemabackend.repository.BookingRepository;
import com.csci.cinemabackend.repository.PaymentCardRepository;
import com.csci.cinemabackend.repository.PaymentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final BookingRepository bookingRepository;
    private final PaymentCardRepository paymentCardRepository;
    private final BookingFinalizationService bookingFinalizationService;
    private final BookingConfirmationService bookingConfirmationService;
    private final PaymentRepository paymentRepository;
    private final PaymentStrategy paymentStrategy;

    public PaymentService(
            BookingRepository bookingRepository,
            PaymentCardRepository paymentCardRepository,
            BookingFinalizationService bookingFinalizationService,
            BookingConfirmationService bookingConfirmationService,
            PaymentRepository paymentRepository,
            PaymentStrategy paymentStrategy) {

        this.bookingRepository = bookingRepository;
        this.paymentCardRepository = paymentCardRepository;
        this.bookingFinalizationService =
                bookingFinalizationService;
        this.bookingConfirmationService =
                bookingConfirmationService;
        this.paymentRepository = paymentRepository;
        this.paymentStrategy = paymentStrategy;
    }

    public PaymentResponse pay(
            Integer bookingId,
            PaymentRequest request,
            User caller) {

        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Payment request is required"
            );
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Booking not found"
                ));

        requireOwnerOrAdmin(booking, caller);

        if (!"Pending".equals(booking.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Booking is not awaiting payment (status: "
                            + booking.getStatus()
                            + ")"
            );
        }

        PaymentCard savedCard = null;
        String cardNumberForPayment;
        String cvvForPayment;

        if (request.getCardId() != null) {
            savedCard = paymentCardRepository
                    .findByCardIdAndUserUserId(
                            request.getCardId(),
                            booking.getUser().getUserId()
                    )
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Payment card not found for this user"
                    ));

            /*
             * The mock strategy only needs the final digits to apply
             * its simulated approval or decline rule.
             */
            cardNumberForPayment =
                    savedCard.getLastFour();

            cvvForPayment =
                    savedCard.getCvv();
        } else {
            requiredText(
                    request.getCardholderName(),
                    "Cardholder name is required"
            );

            String cardNumber = requiredText(
                    request.getCardNumber(),
                    "Card number is required"
            );

            String digitsOnly =
                    cardNumber.replaceAll("\\s", "");

            if (!digitsOnly.matches("\\d{13,19}")) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Card number must contain between 13 and 19 digits"
                );
            }

            validateExpirationDate(
                    request.getExpirationMonth(),
                    request.getExpirationYear()
            );

            String cvv = requiredText(
                    request.getCvv(),
                    "CVV is required"
            );

            if (!cvv.matches("\\d{3,4}")) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "CVV must contain 3 or 4 digits"
                );
            }

            cardNumberForPayment = digitsOnly;
            cvvForPayment = cvv;
        }

        boolean approved =
                paymentStrategy.processPayment(
                        cardNumberForPayment,
                        cvvForPayment
                );

        String paymentReference =
                UUID.randomUUID().toString();

        Payment payment =
                bookingFinalizationService.finalize(
                        bookingId,
                        approved,
                        savedCard,
                        paymentReference
                );

        if (approved) {
            bookingConfirmationService.sendConfirmation(
                    payment
            );
        }

        return new PaymentResponse(payment);
    }

    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll()
                .stream()
                .map(PaymentResponse::new)
                .toList();
    }

    public PaymentResponse getPaymentById(
            Integer paymentId,
            User caller) {

        Payment payment = paymentRepository
                .findById(paymentId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Payment not found"
                        )
                );

        requireOwnerOrAdmin(payment.getBooking(), caller);

        return new PaymentResponse(payment);
    }

    public PaymentResponse getPaymentByBookingId(
            Integer bookingId,
            User caller) {

        Payment payment = paymentRepository
                .findByBookingBookingId(bookingId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Payment not found for booking"
                        )
                );

        requireOwnerOrAdmin(payment.getBooking(), caller);

        return new PaymentResponse(payment);
    }

    /**
     * Throws 404 (not 403) on a mismatch so booking/payment ids can't be
     * enumerated by a caller who isn't authorized to see them.
     */
    private void requireOwnerOrAdmin(Booking booking, User caller) {
        if (Boolean.TRUE.equals(caller.getIsAdmin())) {
            return;
        }

        if (!booking.getUser().getUserId().equals(caller.getUserId())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Booking not found"
            );
        }
    }

    public PaymentResponse updatePaymentStatus(
            Integer paymentId,
            String paymentStatus) {

        Payment payment = paymentRepository
                .findById(paymentId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Payment not found"
                        )
                );

        String normalizedStatus = normalizePaymentStatus(
                paymentStatus
        );

        payment.setPaymentStatus(normalizedStatus);

        Payment updatedPayment =
                paymentRepository.save(payment);

        return new PaymentResponse(updatedPayment);
    }

    public void deletePayment(Integer paymentId) {
        Payment payment = paymentRepository
                .findById(paymentId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Payment not found"
                        )
                );

        paymentRepository.delete(payment);
    }

    private String normalizePaymentStatus(
            String paymentStatus) {

        String normalizedStatus = requiredText(
                paymentStatus,
                "Payment status is required"
        );

        if (normalizedStatus.equalsIgnoreCase("Approved")) {
            return "Approved";
        }

        if (normalizedStatus.equalsIgnoreCase("Declined")) {
            return "Declined";
        }

        if (normalizedStatus.equalsIgnoreCase("Refunded")) {
            return "Refunded";
        }

        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Payment status must be Approved, Declined, or Refunded"
        );
    }

    private void validateExpirationDate(
            Integer expirationMonth,
            Integer expirationYear) {

        if (expirationMonth == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Expiration month is required"
            );
        }

        if (expirationMonth < 1 || expirationMonth > 12) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Expiration month must be between 1 and 12"
            );
        }

        if (expirationYear == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Expiration year is required"
            );
        }

        if (expirationYear < 2000) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Expiration year is invalid"
            );
        }
    }

    private String requiredText(
            String value,
            String errorMessage) {

        if (value == null || value.trim().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    errorMessage
            );
        }

        return value.trim();
    }
}
