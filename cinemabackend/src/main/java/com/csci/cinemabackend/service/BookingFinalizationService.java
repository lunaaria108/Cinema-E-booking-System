package com.csci.cinemabackend.service;

import com.csci.cinemabackend.model.Booking;
import com.csci.cinemabackend.model.Payment;
import com.csci.cinemabackend.model.PaymentCard;
import com.csci.cinemabackend.repository.BookingRepository;
import com.csci.cinemabackend.repository.PaymentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;


@Service
public class BookingFinalizationService {

    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    public BookingFinalizationService(
            BookingRepository bookingRepository,
            PaymentRepository paymentRepository) {

        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public Payment finalize(
            Integer bookingId,
            boolean approved,
            PaymentCard card,
            String paymentReference) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        Payment payment = new Payment();
        payment.setBooking(booking);
        payment.setCard(card);
        payment.setAmount(booking.getTotalPrice());
        payment.setPaymentReference(paymentReference);

        if (approved) {
            booking.setStatus("Paid");
            payment.setPaymentStatus("Approved");
        } else {
            booking.setStatus("Cancelled");
            payment.setPaymentStatus("Declined");
        }

        bookingRepository.save(booking);
        return paymentRepository.save(payment);
    }
}
