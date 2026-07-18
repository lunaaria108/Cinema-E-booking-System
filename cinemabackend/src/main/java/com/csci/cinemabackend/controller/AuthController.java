package com.csci.cinemabackend.controller;

import com.csci.cinemabackend.auth.dto.AuthResponse;
import com.csci.cinemabackend.auth.dto.ForgotPasswordRequest;
import com.csci.cinemabackend.auth.dto.LoginRequest;
import com.csci.cinemabackend.auth.dto.LogoutRequest;
import com.csci.cinemabackend.auth.dto.RegistrationRequest;
import com.csci.cinemabackend.auth.dto.ResetPasswordRequest;
import com.csci.cinemabackend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.csci.cinemabackend.auth.dto.ChangePasswordRequest;

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
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegistrationRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @GetMapping("/confirm-email")
    public ResponseEntity<AuthResponse> confirmEmail(@RequestParam String token) {
        return ResponseEntity.ok(authService.confirmEmail(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(authService.forgotPassword(request));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout(@Valid @RequestBody LogoutRequest request) {
        return ResponseEntity.ok(authService.logout(request));
    }
    @PostMapping("/change-password")
    public ResponseEntity<AuthResponse> changePassword(
        @RequestParam Integer userId,
        @Valid @RequestBody ChangePasswordRequest request) {

        return ResponseEntity.ok(
            authService.changePassword(userId, request)
    );
}
}
