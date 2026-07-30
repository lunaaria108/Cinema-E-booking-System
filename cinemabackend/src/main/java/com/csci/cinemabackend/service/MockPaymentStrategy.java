package com.csci.cinemabackend.service;

import org.springframework.stereotype.Service;

@Service
public class MockPaymentStrategy implements PaymentStrategy {

    @Override
    public boolean processPayment(
            String cardNumber,
            String cvv) {

        if (cardNumber == null) {
            return false;
        }

        String digitsOnly =
                cardNumber.replaceAll("\\D", "");

        /*
         * Mock decline rules:
         *
         * 1. Cards ending in 0000 are declined.
         * 2. CVV 000 is declined.
         */
        if (digitsOnly.endsWith("0000")) {
            return false;
        }

        return !"000".equals(cvv);
    }
}
