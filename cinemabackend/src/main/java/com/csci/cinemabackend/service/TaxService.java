package com.csci.cinemabackend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class TaxService {

    private final BigDecimal taxRate;

    public TaxService(
            @Value("${app.tax.rate:0.07}") BigDecimal taxRate) {

        if (taxRate.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException(
                    "Tax rate cannot be negative."
            );
        }

        this.taxRate = taxRate;
    }

    public BigDecimal calculateTax(BigDecimal taxableAmount) {
        if (taxableAmount == null) {
            throw new IllegalArgumentException(
                    "Taxable amount is required."
            );
        }

        if (taxableAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException(
                    "Taxable amount cannot be negative."
            );
        }

        return taxableAmount
                .multiply(taxRate)
                .setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateTotal(BigDecimal taxableAmount) {
        return taxableAmount
                .add(calculateTax(taxableAmount))
                .setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal getTaxRate() {
        return taxRate;
    }
}
