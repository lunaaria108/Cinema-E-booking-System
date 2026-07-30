package com.csci.cinemabackend.service;

public interface PaymentStrategy {

    boolean processPayment(
            String cardNumber,
            String cvv
    );
}
