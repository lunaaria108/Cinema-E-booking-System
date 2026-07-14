package com.csci.cinemabackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a payment card stored by a user.
 */
@Entity
@Table(name = "paymentcard")
public class PaymentCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "card_id")
    private Integer cardId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(name = "cardholder_name", nullable = false, length = 100)
    private String cardholderName;

    @JsonIgnore
    @Column(name = "card_number", nullable = false, length = 255)
    private String cardNumber;

    @Column(name = "expiration_month", nullable = false)
    private Integer expirationMonth;

    @Column(name = "expiration_year", nullable = false)
    private Integer expirationYear;

    @JsonIgnore
    @Column(name = "cvv", nullable = false, length = 255)
    private String cvv;

    @Column(name = "billing_zip", length = 10)
    private String billingZip;

    @Column(name = "created", nullable = false, updatable = false)
    private LocalDateTime created;

    public PaymentCard() {
    }

    @PrePersist
    protected void onCreate() {
        if (created == null) {
            created = LocalDateTime.now();
        }
    }

    public Integer getCardId() {
        return cardId;
    }

    public User getUser() {
        return user;
    }

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

    public LocalDateTime getCreated() {
        return created;
    }

    public void setUser(User user) {
        this.user = user;
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
