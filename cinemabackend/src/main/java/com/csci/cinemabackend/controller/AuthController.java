package com.csci.cinemabackend.controller;

import com.csci.cinemabackend.auth.dto.ForgotPasswordRequest;
import com.csci.cinemabackend.auth.dto.LoginRequest;
import com.csci.cinemabackend.auth.dto.LogoutRequest;
import com.csci.cinemabackend.auth.dto.RegistrationRequest;
import com.csci.cinemabackend.auth.dto.ResetPasswordRequest;
import com.csci.cinemabackend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import com.csci.cinemabackend.dto.ChangePasswordRequest;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/is-admin")
    public boolean isAdmin(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return authService.isAdmin(token);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegistrationRequest request) {
        try {
            return ResponseEntity.ok(authService.register(request));
        } catch (ResponseStatusException exception) {
            return errorResponse(exception);
        }
    }

    @GetMapping("/confirm-email")
    public ResponseEntity<?> confirmEmail(@RequestParam String token) {
        try {
            return ResponseEntity.ok(authService.confirmEmail(token));
        } catch (ResponseStatusException exception) {
            return errorResponse(exception);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            return ResponseEntity.ok(authService.login(request));
        } catch (ResponseStatusException exception) {
            return errorResponse(exception);
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            return ResponseEntity.ok(authService.forgotPassword(request));
        } catch (ResponseStatusException exception) {
            return errorResponse(exception);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            return ResponseEntity.ok(authService.resetPassword(request));
        } catch (ResponseStatusException exception) {
            return errorResponse(exception);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@Valid @RequestBody LogoutRequest request) {
        try {
            return ResponseEntity.ok(authService.logout(request));
        } catch (ResponseStatusException exception) {
            return errorResponse(exception);
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestParam Integer userId,
            @Valid @RequestBody ChangePasswordRequest request) {

        try {
            return ResponseEntity.ok(authService.changePassword(userId, request));
        } catch (ResponseStatusException exception) {
            return errorResponse(exception);
        }
    }

    private ResponseEntity<?> errorResponse(ResponseStatusException exception) {
        return ResponseEntity.status(exception.getStatusCode()).body(
                Map.of("message", exception.getReason()));
    }
}
