package com.csci.cinemabackend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Represents a promotion created by an administrator.
 * Promotions can be emailed to users who have opted in
 * to receive promotional emails.
 */
@Entity
@Table(name = "promotion")
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "promotion_id")
    private Integer promotionId;

    @Column(name = "promo_code", nullable = false, unique = true, length = 50)
    private String promoCode;

    @Column(name = "description", nullable = false, length = 500)
    private String description;

    @Column(name = "discount_amount", nullable = false)
    private Double discountAmount;

    @Column(name = "is_percentage", nullable = false)
    private Boolean isPercentage;

    @Column(name = "expiration_date", nullable = false)
    private LocalDate expirationDate;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "created", nullable = false, updatable = false)
    private LocalDate created;

    public Promotion() {
    }

    @PrePersist
    protected void onCreate() {
        if (created == null) {
            created = LocalDate.now();
        }

        if (isActive == null) {
            isActive = true;
        }
    }

    public Integer getPromotionId() {
        return promotionId;
    }

    public String getPromoCode() {
        return promoCode;
    }

    public void setPromoCode(String promoCode) {
        this.promoCode = promoCode;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(Double discountAmount) {
        this.discountAmount = discountAmount;
    }

    public Boolean getIsPercentage() {
        return isPercentage;
    }

    public void setIsPercentage(Boolean isPercentage) {
        this.isPercentage = isPercentage;
    }

    public LocalDate getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(LocalDate expirationDate) {
        this.expirationDate = expirationDate;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public LocalDate getCreated() {
        return created;
    }
}
