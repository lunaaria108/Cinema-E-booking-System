package com.csci.cinemabackend.controller;

import com.csci.cinemabackend.dto.UpdateProfileRequest;
import com.csci.cinemabackend.model.FavoriteMovie;
import com.csci.cinemabackend.model.User;
import com.csci.cinemabackend.service.FavoriteMovieService;
import com.csci.cinemabackend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Handles user profile and favorite movie requests.
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final FavoriteMovieService favoriteMovieService;

    public UserController(
            UserService userService,
            FavoriteMovieService favoriteMovieService) {

        this.userService = userService;
        this.favoriteMovieService = favoriteMovieService;
    }

    /**
     * Retrieves a user's profile.
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
     */
    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUserProfile(
            @PathVariable Integer userId,
            @RequestBody UpdateProfileRequest request) {

        Optional<User> updatedUser = userService.updateProfile(
                userId,
                request.getUserName(),
                request.getFirstName(),
                request.getLastName()
        );

        if (updatedUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedUser.get());
    }

    /**
     * Retrieves all favorite movies for a user.
     */
    @GetMapping("/{userId}/favorites")
    public ResponseEntity<List<FavoriteMovie>> getFavorites(
            @PathVariable Integer userId) {

        if (userService.getUserById(userId).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                favoriteMovieService.getFavorites(userId)
        );
    }

    /**
     * Adds a movie to a user's favorite list.
     */
    @PostMapping("/{userId}/favorites/{movieId}")
    public ResponseEntity<FavoriteMovie> addFavorite(
            @PathVariable Integer userId,
            @PathVariable Integer movieId) {

        Optional<FavoriteMovie> favorite =
                favoriteMovieService.addFavorite(userId, movieId);

        if (favorite.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(favorite.get());
    }

    /**
     * Removes a movie from a user's favorite list.
     */
    @DeleteMapping("/{userId}/favorites/{movieId}")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable Integer userId,
            @PathVariable Integer movieId) {

        boolean removed =
                favoriteMovieService.removeFavorite(userId, movieId);

        if (!removed) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}
