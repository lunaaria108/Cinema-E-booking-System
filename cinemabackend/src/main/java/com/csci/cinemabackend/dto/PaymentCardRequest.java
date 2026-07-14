package com.csci.cinemabackend.dto;

/**
 * Contains payment-card information submitted by a user.
 */
public class PaymentCardRequest {

    private String cardholderName;
    private String cardNumber;
    private Integer expirationMonth;
    private Integer expirationYear;
    private String cvv;
    private String billingZip;

    public String getCardholderName() {
        return cardholderName;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public Integer getExpirationMonth() {
        return expirationMonth;
    }

    public Integer getExpirationYear() {
        return expirationYear;
    }

    public String getCvv() {
        return cvv;
    }

    public String getBillingZip() {
        return billingZip;
    }

    public void setCardholderName(String cardholderName) {
        this.cardholderName = cardholderName;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public void setExpirationMonth(Integer expirationMonth) {
        this.expirationMonth = expirationMonth;
    }

    public void setExpirationYear(Integer expirationYear) {
        this.expirationYear = expirationYear;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }

    public void setBillingZip(String billingZip) {
        this.billingZip = billingZip;
    }
}
