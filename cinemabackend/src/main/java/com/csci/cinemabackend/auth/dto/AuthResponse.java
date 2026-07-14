package com.csci.cinemabackend.auth.dto;

public record AuthResponse(
        String message,
        Integer userId,
        String username,
        String email,
        Boolean isAdmin,
        Boolean isActive,
        String sessionToken,
        String verificationToken,
        String resetToken) {
}