package com.csci.cinemabackend.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.csci.cinemabackend.dto.PaymentCardRequest;
import com.csci.cinemabackend.dto.UpdateProfileRequest;
import com.csci.cinemabackend.model.FavoriteMovie;
import com.csci.cinemabackend.model.PaymentCard;
import com.csci.cinemabackend.model.User;
import com.csci.cinemabackend.service.FavoriteMovieService;
import com.csci.cinemabackend.service.PaymentCardService;
import com.csci.cinemabackend.service.UserService;
import com.csci.cinemabackend.dto.ChangeEmailRequest;

/**
 * Handles user profile, favorite movie, and payment card requests.
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final FavoriteMovieService favoriteMovieService;
    private final PaymentCardService paymentCardService;

    public UserController(
            UserService userService,
            FavoriteMovieService favoriteMovieService,
            PaymentCardService paymentCardService) {

        this.userService = userService;
        this.favoriteMovieService = favoriteMovieService;
        this.paymentCardService = paymentCardService;
    }

    /*
     * =========================================================
     * PROFILE ENDPOINTS
     * =========================================================
     */

    /**
     * Retrieves a user's profile.
     *
     * GET /api/users/{userId}
     */
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserProfile(
            @PathVariable Integer userId) {

        Optional<User> user = userService.getUserById(userId);

        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user.get());
    }

    /**
     * Updates the editable fields of a user's profile.
     *
     * Email, password, administrator status, and account status
     * cannot be changed through this endpoint.
     *
     * PUT /api/users/{userId}
     */
    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUserProfile(
            @PathVariable Integer userId,
            @RequestBody UpdateProfileRequest request) {

        Optional<User> updatedUser = userService.updateProfile(
                userId,
                request.getUserName(),
                request.getFirstName(),
                request.getLastName(),
                request.getEmail(),
                request.getPhoneNumber(),
                request.getStreetAddress(),
                request.getPromoOptIn());

        if (updatedUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedUser.get());
    }

    /*
     * =========================================================
     * FAVORITE MOVIE ENDPOINTS
     * =========================================================
     */

    /**
     * Retrieves all favorite movies stored for a user.
     *
     * GET /api/users/{userId}/favorites
     */
    @GetMapping("/{userId}/favorites")
    public ResponseEntity<List<FavoriteMovie>> getFavorites(
            @PathVariable Integer userId) {

        if (userService.getUserById(userId).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<FavoriteMovie> favorites = favoriteMovieService.getFavorites(userId);

        return ResponseEntity.ok(favorites);
    }

    /**
     * Adds a movie to a user's favorite list.
     *
     * POST /api/users/{userId}/favorites/{movieId}
     */
    @PostMapping("/{userId}/favorites/{movieId}")
    public ResponseEntity<FavoriteMovie> addFavorite(
            @PathVariable Integer userId,
            @PathVariable Integer movieId) {

        Optional<FavoriteMovie> favorite = favoriteMovieService.addFavorite(userId, movieId);

        if (favorite.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(favorite.get());
    }

    /**
     * Removes a movie from a user's favorite list.
     *
     * DELETE /api/users/{userId}/favorites/{movieId}
     */
    @DeleteMapping("/{userId}/favorites/{movieId}")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable Integer userId,
            @PathVariable Integer movieId) {

        boolean removed = favoriteMovieService.removeFavorite(userId, movieId);

        if (!removed) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

    /*
     * =========================================================
     * PAYMENT CARD ENDPOINTS
     * =========================================================
     */

    /**
     * Retrieves all stored payment cards for a user.
     *
     * GET /api/users/{userId}/cards
     */
    @GetMapping("/{userId}/cards")
    public ResponseEntity<List<PaymentCard>> getPaymentCards(
            @PathVariable Integer userId) {

        if (userService.getUserById(userId).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        List<PaymentCard> cards = paymentCardService.getCards(userId);

        return ResponseEntity.ok(cards);
    }

    /**
     * Adds a payment card for a user.
     *
     * POST /api/users/{userId}/cards
     */
    @PostMapping("/{userId}/cards")
    public ResponseEntity<?> addPaymentCard(
            @PathVariable Integer userId,
            @RequestBody PaymentCardRequest request) {

        try {
            Optional<PaymentCard> card = paymentCardService.addCard(
                    userId,
                    request.getCardholderName(),
                    request.getCardNumber(),
                    request.getExpirationMonth(),
                    request.getExpirationYear(),
                    request.getCvv(),
                    request.getBillingZip());

            if (card.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(card.get());

        } catch (IllegalArgumentException | IllegalStateException exception) {

            return ResponseEntity.badRequest().body(
                    Map.of("message", exception.getMessage()));
        }
    }

    @PutMapping("/{userId}/cards/{cardId}")
    public ResponseEntity<?> updatePaymentCard(
            @PathVariable Integer userId,
            @PathVariable Integer cardId,
            @RequestBody PaymentCardRequest request) {

        try {
            Optional<PaymentCard> card = paymentCardService.updateCard(
                    userId,
                    cardId,
                    request.getCardholderName(),
                    request.getCardNumber(),
                    request.getExpirationMonth(),
                    request.getExpirationYear(),
                    request.getCvv(),
                    request.getBillingZip());

            if (card.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(card.get());

        } catch (IllegalArgumentException | IllegalStateException exception) {

            return ResponseEntity.badRequest().body(
                    Map.of("message", exception.getMessage()));
        }
    }

    /**
     * Deletes a stored payment card.
     *
     * DELETE /api/users/{userId}/cards/{cardId}
     */
    @DeleteMapping("/{userId}/cards/{cardId}")
    public ResponseEntity<Void> deletePaymentCard(
            @PathVariable Integer userId,
            @PathVariable Integer cardId) {

        boolean deleted = paymentCardService.deleteCard(userId, cardId);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

    /**
     * Email Change endpoint.
     * Verifies user auth
     * Verify correct password
     * Check db to ensure email not in use
     * save.
     * generate new emailverification for user
     * send email to the new address with verification token
     */
    @PostMapping("/{userId}/change-email")
    public ResponseEntity<?> requestEmailChange(
            @PathVariable Integer userId,
            @RequestBody ChangeEmailRequest request) {
        try {
            userService.requestEmailChange(userId, request.getNewEmail(), request.getCurrentPassword());
            return ResponseEntity.ok(Map.of("message", "Email change request sent successfully"));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(Map.of("message", exception.getMessage()));
        } catch (org.springframework.web.server.ResponseStatusException exception) {
            return ResponseEntity.status(exception.getStatusCode()).body(
                    Map.of("message",
                            exception.getReason()));
        } catch (Exception exception) {
            return ResponseEntity.status(org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of("message", "An unexpected error occured: " + exception.getMessage()));
        }
    }

}
