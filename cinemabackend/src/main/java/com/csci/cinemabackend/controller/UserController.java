package com.csci.cinemabackend.controller;

import com.csci.cinemabackend.dto.UpdateProfileRequest;
import com.csci.cinemabackend.model.User;
import com.csci.cinemabackend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

/**
 * Handles user profile requests.
 */
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Retrieves a user's profile.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserProfile(@PathVariable Integer userId) {
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
}
