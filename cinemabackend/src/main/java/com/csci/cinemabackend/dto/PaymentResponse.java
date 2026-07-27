package com.csci.cinemabackend.dto;

import com.csci.cinemabackend.model.Payment;

import java.math.BigDecimal;

public class PaymentResponse {

    private final Integer bookingId;
    private final String bookingStatus;
    private final String paymentStatus;
    private final String paymentReference;
    private final BigDecimal amount;

    public PaymentResponse(Payment payment) {
        this.bookingId = payment.getBooking().getBookingId();
        this.bookingStatus = payment.getBooking().getStatus();
        this.paymentStatus = payment.getPaymentStatus();
        this.paymentReference = payment.getPaymentReference();
        this.amount = payment.getAmount();
    }

    public Integer getBookingId() {
        return bookingId;
    }

    public String getBookingStatus() {
        return bookingStatus;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public String getPaymentReference() {
        return paymentReference;
    }

    public BigDecimal getAmount() {
        return amount;
    }
}
