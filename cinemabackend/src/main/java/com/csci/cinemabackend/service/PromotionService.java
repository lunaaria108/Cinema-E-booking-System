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

    /*
     * Create and save a new promotion.
     */
    public Promotion createPromotion(Promotion promotion) {
        validatePromotion(promotion);

        String normalizedCode =
                promotion.getPromoCode().trim().toUpperCase();

        promotion.setPromoCode(normalizedCode);
        promotion.setDescription(promotion.getDescription().trim());

        Promotion savedPromotion =
                promotionRepository.save(promotion);

        sendPromotionEmails(savedPromotion);

        return savedPromotion;
    }

    /*
     * Return all promotions.
     */
    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    /*
     * Return one promotion or throw an error when it does not exist.
     */
    public Promotion getPromotionById(Integer id) {
        return promotionRepository.findById(id)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Promotion not found with ID: " + id
                        )
                );
    }

    /*
     * Update the editable information for a promotion.
     */
    public Promotion updatePromotion(
            Integer id,
            Promotion promotionDetails
    ) {
        Promotion existingPromotion =
                getPromotionById(id);

        validatePromotion(promotionDetails);

        existingPromotion.setPromoCode(
                promotionDetails.getPromoCode()
                        .trim()
                        .toUpperCase()
        );

        existingPromotion.setDescription(
                promotionDetails.getDescription().trim()
        );

        existingPromotion.setDiscountAmount(
                promotionDetails.getDiscountAmount()
        );

        existingPromotion.setIsPercentage(
                promotionDetails.getIsPercentage()
        );

        existingPromotion.setExpirationDate(
                promotionDetails.getExpirationDate()
        );

        existingPromotion.setIsActive(
                promotionDetails.getIsActive()
        );

        return promotionRepository.save(existingPromotion);
    }

    /*
     * Switch a promotion between active and inactive.
     */
    public Promotion togglePromotion(Integer id) {
        Promotion promotion =
                getPromotionById(id);

        Boolean currentStatus =
                promotion.getIsActive();

        promotion.setIsActive(
                !Boolean.TRUE.equals(currentStatus)
        );

        return promotionRepository.save(promotion);
    }

    /*
     * Delete an existing promotion.
     */
    public void deletePromotion(Integer id) {
        Promotion promotion =
                getPromotionById(id);

        promotionRepository.delete(promotion);
    }

    /*
     * Validate promotion information before saving.
     */
    private void validatePromotion(Promotion promotion) {
        if (promotion == null) {
            throw new IllegalArgumentException(
                    "Promotion is required."
            );
        }

        if (promotion.getPromoCode() == null
                || promotion.getPromoCode().trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Promotion code is required."
            );
        }

        if (promotion.getDescription() == null
                || promotion.getDescription().trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Promotion description is required."
            );
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
            throw new IllegalArgumentException(
                    "Expiration date is required."
            );
        }

        if (promotion.getExpirationDate()
                .isBefore(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "Expiration date cannot be in the past."
            );
        }
    }

    /*
     * Email the promotion to users who opted in.
     */
    private void sendPromotionEmails(Promotion promotion) {
        List<User> subscribedUsers =
                userRepository.findByPromoOptInTrue();

        String discountText;

        if (Boolean.TRUE.equals(
                promotion.getIsPercentage()
        )) {
            discountText =
                    promotion.getDiscountAmount() + "% off";
        } else {
            discountText =
                    "$" + promotion.getDiscountAmount() + " off";
        }

        String subject =
                "Cinema Promotion: "
                        + promotion.getPromoCode();

        for (User user : subscribedUsers) {
            String body =
                    "Hello " + user.getFirstName() + ",\n\n"
                    + promotion.getDescription() + "\n\n"
                    + "Promotion code: "
                    + promotion.getPromoCode() + "\n"
                    + "Discount: "
                    + discountText + "\n"
                    + "Expiration date: "
                    + promotion.getExpirationDate() + "\n\n"
                    + "Thank you for choosing our cinema.";

            mailService.send(
                    user.getEmail(),
                    subject,
                    body
            );
        }
    }
}
