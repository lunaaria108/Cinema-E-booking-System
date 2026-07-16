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
    private final MailService mailService;

    public UserService(
            UserRepository userRepository,
            MailService mailService) {

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
            String phoneNumber,
            String streetAddress)

        Optional<User> optionalUser = userRepository.findById(userId);

   if (userName != null && !userName.isBlank()) {
    user.setUserName(userName.trim());
}

if (firstName != null && !firstName.isBlank()) {
    user.setFirstName(firstName.trim());
}

if (lastName != null && !lastName.isBlank()) {
    user.setLastName(lastName.trim());
}

if (phoneNumber != null && !phoneNumber.isBlank()) {
    user.setPhoneNumber(phoneNumber.trim());
}

if (streetAddress != null && !streetAddress.isBlank()) {
    user.setStreetAddress(streetAddress.trim());
}
        User savedUser = userRepository.save(user);

        mailService.send(
                savedUser.getEmail(),
                "Your Cinema E-Booking profile was updated",
                "Hello " + savedUser.getFirstName() + ",\n\n"
                        + "Your profile information was updated successfully.\n\n"
                        + "If you made this change, no further action is required.\n"
                        + "If you did not make this change, please contact support immediately."
        );

        return Optional.of(savedUser);
    }
}
