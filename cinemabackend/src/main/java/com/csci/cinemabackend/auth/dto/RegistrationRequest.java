package com.csci.cinemabackend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegistrationRequest(

        @NotBlank
        String firstname,

        @NotBlank
        String lastname,

        @NotBlank
        String username,

        @NotBlank
        @Email
        String email,

        @NotBlank
        @Pattern(
                regexp = "^[0-9()+\\-\\s]{7,20}$",
                message = "Phone number must be valid"
        )
        String phoneNumber,

        @Size(
                max = 255,
                message = "Street address is too long"
        )
        String streetAddress,

        @NotBlank
        @Size(
                min = 8,
                message = "Password must be at least 8 characters"
        )
        String password,

        @NotBlank
        String confirmPassword,

        Boolean promoOptIn

) {
}
