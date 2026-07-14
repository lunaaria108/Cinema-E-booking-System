package com.csci.cinemabackend.service;

import com.csci.cinemabackend.model.User;
import com.csci.cinemabackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Handles user profile management.
 */
@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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
            String lastName) {

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

        return Optional.of(userRepository.save(user));
    }
}
