package com.csci.cinemabackend.service;

import com.csci.cinemabackend.model.PaymentCard;
import com.csci.cinemabackend.model.User;
import com.csci.cinemabackend.repository.PaymentCardRepository;
import com.csci.cinemabackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.Optional;


/**
 * 
 * Handles payment-card management and encryption.
 */
@Service
public class PaymentCardService {

    private static final int MAXIMUM_CARDS = 3;
    private static final int IV_LENGTH = 12;
    private static final int AUTHENTICATION_TAG_LENGTH = 128;

    private final PaymentCardRepository paymentCardRepository;
    private final UserRepository userRepository;
    private final SecretKeySpec encryptionKey;
    private final SecureRandom secureRandom = new SecureRandom();
    private final MailService mailService;

    public PaymentCardService(
            PaymentCardRepository paymentCardRepository,
            UserRepository userRepository,
            MailService mailService,
            @Value("${card.encryption.key}") String encodedKey) {

        this.paymentCardRepository = paymentCardRepository;
        this.userRepository = userRepository;
        this.mailService = mailService;

        byte[] keyBytes = Base64.getDecoder().decode(encodedKey);

        if (keyBytes.length != 32) {
            throw new IllegalArgumentException(
                    "The card encryption key must decode to exactly 32 bytes."
            );
        }

        this.encryptionKey = new SecretKeySpec(keyBytes, "AES");
    }

    /**
     * Retrieves all stored payment cards for a user.
     */
    public List<PaymentCard> getCards(Integer userId) {
        return paymentCardRepository.findByUserUserId(userId);
    }

    /**
     * Adds a payment card if the user exists and has fewer than three cards.
     */
    public Optional<PaymentCard> addCard(
            Integer userId,
            String cardholderName,
            String cardNumber,
            Integer expirationMonth,
            Integer expirationYear,
            String cvv,
            String billingZip) {

        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isEmpty()) {
            return Optional.empty();
        }

        long existingCardCount =
                paymentCardRepository.countByUserUserId(userId);

        if (existingCardCount >= MAXIMUM_CARDS) {
            throw new IllegalStateException(
                    "A user may store a maximum of 3 payment cards."
            );
        }

        validateCardInformation(
                cardholderName,
                cardNumber,
                expirationMonth,
                expirationYear,
                cvv
        );

        PaymentCard paymentCard = new PaymentCard();

        paymentCard.setUser(optionalUser.get());
        paymentCard.setCardholderName(cardholderName.trim());
        String rawCardNumber = cardNumber.replaceAll("\\s", "");

        paymentCard.setLastFour(
        rawCardNumber.substring(rawCardNumber.length() - 4)
        );

        paymentCard.setCardNumber(encrypt(rawCardNumber));
        paymentCard.setExpirationMonth(expirationMonth);
        paymentCard.setExpirationYear(expirationYear);
        paymentCard.setCvv(encrypt(cvv.trim()));
        paymentCard.setBillingZip(
                billingZip == null ? null : billingZip.trim()
        );

        return Optional.of(paymentCardRepository.save(paymentCard));
    }
        public Optional<PaymentCard> updateCard(
                Integer userId,
                Integer cardId,
                String cardholderName,
                String cardNumber,
                Integer expirationMonth,
                Integer expirationYear,
                String cvv,
                String billingZip) {

        Optional<User> optionalUser = userRepository.findById(userId);

        if (optionalUser.isEmpty()) {
                return Optional.empty();
        }

        Optional<PaymentCard> optionalCard =
                paymentCardRepository.findById(cardId);

        if (optionalCard.isEmpty()) {
                return Optional.empty();
        }

        PaymentCard card = optionalCard.get();

        // Make sure the card belongs to the user
        if (!card.getUser().getUserId().equals(userId)) {
                return Optional.empty();
        }

        card.setCardholderName(cardholderName.trim());
        String rawCardNumber = cardNumber.replaceAll("\\s", "");

        card.setLastFour(
        rawCardNumber.substring(rawCardNumber.length() - 4)
        );

        card.setCardNumber(encrypt(rawCardNumber));
        card.setExpirationMonth(expirationMonth);
        card.setExpirationYear(expirationYear);
        card.setCvv(cvv.trim());
        card.setBillingZip(billingZip.trim());

        PaymentCard savedCard = paymentCardRepository.save(card);

        User user = optionalUser.get();

        mailService.send(
                user.getEmail(),
                "Your Cinema E-Booking payment card was updated",
                "Hello " + user.getFirstName() + ",\n\n"
                        + "One of your saved payment methods was updated successfully.\n\n"
                        + "If you made this change, no further action is required.\n"
                        + "If you did not make this change, please contact support immediately."
        );

        return Optional.of(savedCard);
        }
    /**
     * Deletes a payment card only when it belongs to the specified user.
     */
    public boolean deleteCard(Integer userId, Integer cardId) {

        Optional<PaymentCard> card =
                paymentCardRepository.findByCardIdAndUserUserId(
                        cardId,
                        userId
                );

        if (card.isEmpty()) {
            return false;
        }

        paymentCardRepository.delete(card.get());
        return true;
    }

    private void validateCardInformation(
            String cardholderName,
            String cardNumber,
            Integer expirationMonth,
            Integer expirationYear,
            String cvv) {

        if (cardholderName == null || cardholderName.isBlank()) {
            throw new IllegalArgumentException(
                    "Cardholder name is required."
            );
        }

        if (cardNumber == null ||
                !cardNumber.matches("\\d{13,19}")) {

            throw new IllegalArgumentException(
                    "Card number must contain between 13 and 19 digits."
            );
        }

        if (expirationMonth == null ||
                expirationMonth < 1 ||
                expirationMonth > 12) {

            throw new IllegalArgumentException(
                    "Expiration month must be between 1 and 12."
            );
        }

        if (expirationYear == null) {
            throw new IllegalArgumentException(
                    "Expiration year is required."
            );
        }

        if (cvv == null || !cvv.matches("\\d{3,4}")) {
            throw new IllegalArgumentException(
                    "CVV must contain 3 or 4 digits."
            );
        }
    }

    /**
     * Encrypts sensitive payment-card information using AES-GCM.
     */
    private String encrypt(String value) {

        try {
            byte[] initializationVector = new byte[IV_LENGTH];
            secureRandom.nextBytes(initializationVector);

            Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");

            GCMParameterSpec parameterSpec =
                    new GCMParameterSpec(
                            AUTHENTICATION_TAG_LENGTH,
                            initializationVector
                    );

            cipher.init(
                    Cipher.ENCRYPT_MODE,
                    encryptionKey,
                    parameterSpec
            );

            byte[] encryptedValue = cipher.doFinal(
                    value.getBytes(StandardCharsets.UTF_8)
            );

            byte[] combined =
                    new byte[initializationVector.length
                            + encryptedValue.length];

            System.arraycopy(
                    initializationVector,
                    0,
                    combined,
                    0,
                    initializationVector.length
            );

            System.arraycopy(
                    encryptedValue,
                    0,
                    combined,
                    initializationVector.length,
                    encryptedValue.length
            );

            return Base64.getEncoder().encodeToString(combined);

        } catch (Exception exception) {
            throw new IllegalStateException(
                    "Unable to encrypt payment-card information.",
                    exception
            );
        }
    }
}
