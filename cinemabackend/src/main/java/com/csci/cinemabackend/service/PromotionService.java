package com.csci.cinemabackend.service;

import com.csci.cinemabackend.model.Promotion;
import com.csci.cinemabackend.model.User;
import com.csci.cinemabackend.repository.PromotionRepository;
import com.csci.cinemabackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PromotionService {

    private final PromotionRepository promotionRepository;
    private final UserRepository userRepository;
    private final MailService mailService;

    public PromotionService(
            PromotionRepository promotionRepository,
            UserRepository userRepository,
            MailService mailService
    ) {
        this.promotionRepository = promotionRepository;
        this.userRepository = userRepository;
        this.mailService = mailService;
    }

    public Promotion createPromotion(Promotion promotion) {
        validatePromotion(promotion);

        promotion.setPromoCode(
                promotion.getPromoCode().trim().toUpperCase()
        );

        Promotion savedPromotion = promotionRepository.save(promotion);

        sendPromotionEmails(savedPromotion);

        return savedPromotion;
    }

    private void validatePromotion(Promotion promotion) {
        if (promotion == null) {
            throw new IllegalArgumentException("Promotion is required.");
        }

        if (promotion.getPromoCode() == null
                || promotion.getPromoCode().trim().isEmpty()) {
            throw new IllegalArgumentException("Promotion code is required.");
        }

        if (promotion.getDescription() == null
                || promotion.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException("Promotion description is required.");
        }

        if (promotion.getDiscountAmount() == null
                || promotion.getDiscountAmount() <= 0) {
            throw new IllegalArgumentException(
                    "Discount amount must be greater than zero."
            );
        }

        if (Boolean.TRUE.equals(promotion.getIsPercentage())
                && promotion.getDiscountAmount() > 100) {
            throw new IllegalArgumentException(
                    "Percentage discount cannot be greater than 100."
            );
        }

        if (promotion.getExpirationDate() == null) {
            throw new IllegalArgumentException("Expiration date is required.");
        }

        if (promotion.getExpirationDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "Expiration date cannot be in the past."
            );
        }
    }

    private void sendPromotionEmails(Promotion promotion) {
        List<User> subscribedUsers = userRepository.findByPromoOptInTrue();

        String discountText;

        if (Boolean.TRUE.equals(promotion.getIsPercentage())) {
            discountText = promotion.getDiscountAmount() + "% off";
        } else {
            discountText = "$" + promotion.getDiscountAmount() + " off";
        }

        String subject = "Cinema Promotion: " + promotion.getPromoCode();

        for (User user : subscribedUsers) {
            String body =
                    "Hello " + user.getFirstName() + ",\n\n"
                    + promotion.getDescription() + "\n\n"
                    + "Promotion code: " + promotion.getPromoCode() + "\n"
                    + "Discount: " + discountText + "\n"
                    + "Expiration date: " + promotion.getExpirationDate() + "\n\n"
                    + "Thank you for choosing our cinema.";

            mailService.send(user.getEmail(), subject, body);
        }
    }
}
