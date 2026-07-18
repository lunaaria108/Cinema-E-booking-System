package com.csci.cinemabackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * Represents a registered user in the Cinema E-Booking System.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "user_name", nullable = false, length = 100)
    private String userName;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column(name = "street_address", nullable = false, length = 255)
    private String streetAddress;

    @Column(name = "promo_opt_in", nullable = false)
    private Boolean promoOptIn = true;

    /**
     * Stores the securely hashed password, never the plaintext password.
     */
    @JsonIgnore
    @Column(name = "password", nullable = false, length = 255)
    private String password;

    @Column(name = "is_admin", nullable = false)
    private Boolean isAdmin = false;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = false;

    @Column(name = "created", nullable = false, updatable = false)
    private LocalDateTime created;

    public User() {
    }

    @PrePersist
    protected void onCreate() {
        if (created == null) {
            created = LocalDateTime.now();
        }

        if (isAdmin == null) {
            isAdmin = false;
        }

        if (isActive == null) {
            isActive = false;
        }

        if (promoOptIn == null) {
            promoOptIn = true;
        }
    }

    public Integer getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getUserName() {
        return userName;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getStreetAddress() {
        return streetAddress;
    }

    public Boolean getPromoOptIn() {
        return promoOptIn;
    }

    public String getPassword() {
        return password;
    }

    public Boolean getIsAdmin() {
        return isAdmin;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public LocalDateTime getCreated() {
        return created;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public void setPromoOptIn(Boolean promoOptIn) {
        this.promoOptIn = promoOptIn;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setIsAdmin(Boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
