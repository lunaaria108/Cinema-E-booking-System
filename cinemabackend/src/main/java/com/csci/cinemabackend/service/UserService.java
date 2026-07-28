package com.csci.cinemabackend.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.csci.cinemabackend.model.User;
import com.csci.cinemabackend.repository.UserRepository;

import com.csci.cinemabackend.repository.EmailVerificationTokenRepository;
import com.csci.cinemabackend.model.EmailVerificationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

/**
 * Handles user profile management.
 */
@Service
public class UserService {

    private final EmailVerificationTokenRepository tokenRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final MailService mailService;

    public UserService(
            EmailVerificationTokenRepository tokenRepository,
            BCryptPasswordEncoder passwordEncoder,
            UserRepository userRepository,
            MailService mailService) {

        this.tokenRepository = tokenRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.userRepository = userRepository;
        this.mailService = mailService;
    }

    /**
     * Retrieves a user by their ID.
     */
    public Optional<User> getUserById(Integer userId) {
        return userRepository.findById(userId);
    }

    /**
     * Updates editable profile information.
     *
     * The email, password, role, account status, and creation date
     * are not changed through profile editing.
     */
    public Optional<User> updateProfile(
            Integer userId,
            String userName,
            String firstName,
            String lastName,
            String email,
            String phoneNumber,
            String streetAddress,
            Boolean promoOptIn) {

        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isEmpty()) {
            return Optional.empty();
        }

        User user = optionalUser.get();

        if (userName != null && !userName.isBlank()) {
            user.setUserName(userName.trim());
        }

        if (firstName != null && !firstName.isBlank()) {
            user.setFirstName(firstName.trim());
        }

        if (lastName != null && !lastName.isBlank()) {
            user.setLastName(lastName.trim());
        }

        if (email != null && !email.isBlank()) {
            user.setEmail(email.trim());
        }

        if (phoneNumber != null && !phoneNumber.isBlank()) {
            user.setPhoneNumber(phoneNumber.trim());
        }

        if (streetAddress != null && !streetAddress.isBlank()) {
            user.setStreetAddress(streetAddress.trim());
        }

        if (promoOptIn != null) {
            user.setPromoOptIn(promoOptIn);
        }

        User savedUser = userRepository.save(user);

        mailService.send(
                savedUser.getEmail(),
                "Your Cinema E-Booking profile was updated",
                "Hello " + savedUser.getFirstName() + ",\n\n"
                        + "Your profile information was updated successfully.\n\n"
                        + "If you made this change, no further action is required.\n"
                        + "If you did not make this change, please contact support immediately.");

        return Optional.of(savedUser);
    }

    /**
     * Validates the current password.
     */
    private void validateCurrentPassword(User user, String rawPassword) {
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Current password is incorrect");
        }
    }

    /**
     * Creates the requestEmailChange
     */

    @org.springframework.transaction.annotation.Transactional
    public void requestEmailChange(Integer userId, String newEmail, String currentPassword) {
        // Checking if user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Validating current password
        validateCurrentPassword(user, currentPassword);

        // Normalize & validate if email is already in use

        String normalizedEmail = newEmail.trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }

        // Update userw ith pending email
        user.setPendingEmail(normalizedEmail);
        userRepository.save(user);

        // Delete existing verification tokens for user
        tokenRepository.deleteByUserUserId(userId);

        // Create new verification token
        String token = UUID.randomUUID().toString();
        EmailVerificationToken emailVerificationToken = new EmailVerificationToken();
        emailVerificationToken.setUser(user);
        emailVerificationToken.setToken(token);
        emailVerificationToken.setCreated(Instant.now());
        emailVerificationToken.setExpiresAt(Instant.now().plus(7, ChronoUnit.DAYS));

        tokenRepository.save(emailVerificationToken);

        // Send verification email
        mailService.send(normalizedEmail, "Verify Your New Email",
                "Hello " + user.getFirstName() + ",\n\n"
                        + "Please confirm your new email address by using this token: " + token + "\n\n"
                        + "Or click this link: http://localhost:5173/confirmation?token=" + token);
    }
}
