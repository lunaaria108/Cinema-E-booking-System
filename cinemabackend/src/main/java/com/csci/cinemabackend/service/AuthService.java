package com.csci.cinemabackend.service;

import org.springframework.transaction.annotation.Transactional;
import com.csci.cinemabackend.auth.dto.AuthResponse;
import com.csci.cinemabackend.auth.dto.ForgotPasswordRequest;
import com.csci.cinemabackend.auth.dto.LoginRequest;
import com.csci.cinemabackend.auth.dto.LogoutRequest;
import com.csci.cinemabackend.auth.dto.RegistrationRequest;
import com.csci.cinemabackend.auth.dto.ResetPasswordRequest;
import com.csci.cinemabackend.model.EmailVerificationToken;
import com.csci.cinemabackend.model.PasswordResetToken;
import com.csci.cinemabackend.model.User;
import com.csci.cinemabackend.model.UserSession;
import com.csci.cinemabackend.repository.EmailVerificationTokenRepository;
import com.csci.cinemabackend.repository.PasswordResetTokenRepository;
import com.csci.cinemabackend.repository.UserRepository;
import com.csci.cinemabackend.repository.UserSessionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final UserSessionRepository userSessionRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final MailService mailService;

    private final long verificationExpirationHours;
    private final long resetExpirationMinutes;
    private final long sessionExpirationHours;

    public AuthService(
            UserRepository userRepository,
            EmailVerificationTokenRepository emailVerificationTokenRepository,
            PasswordResetTokenRepository passwordResetTokenRepository,
            UserSessionRepository userSessionRepository,
            MailService mailService,
            @Value("${app.auth.verification-expiration-hours:24}")
            long verificationExpirationHours,
            @Value("${app.auth.reset-expiration-minutes:30}")
            long resetExpirationMinutes,
            @Value("${app.auth.session-expiration-hours:8}")
            long sessionExpirationHours) {

        this.userRepository = userRepository;
        this.emailVerificationTokenRepository =
                emailVerificationTokenRepository;
        this.passwordResetTokenRepository =
                passwordResetTokenRepository;
        this.userSessionRepository = userSessionRepository;
        this.mailService = mailService;
        this.passwordEncoder = new BCryptPasswordEncoder();

        this.verificationExpirationHours =
                verificationExpirationHours;
        this.resetExpirationMinutes =
                resetExpirationMinutes;
        this.sessionExpirationHours =
                sessionExpirationHours;
    }

    public boolean isAdmin(String token) {
    UserSession session = userSessionRepository
            .findByTokenAndRevokedFalse(token)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid session token"));

    if (session.getExpiresAt().isBefore(Instant.now())) {
        throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Session expired");
    }
    return session.getUser().getIsAdmin();
}

    public AuthResponse register(RegistrationRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Passwords do not match"
            );
        }

        String normalizedEmail =
                request.email().trim().toLowerCase();
        String normalizedUsername =
                request.username().trim();

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)
                || userRepository.existsByUserNameIgnoreCase(
                        normalizedUsername)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email or username already exists"
            );
        }

        User user = new User();
        user.setFirstName(request.firstname().trim());
        user.setLastName(request.lastname().trim());
        user.setUserName(normalizedUsername);
        user.setEmail(normalizedEmail);
        user.setPhoneNumber(request.phoneNumber().trim());
        user.setStreetAddress(request.streetAddress().trim());
        user.setPassword(
                passwordEncoder.encode(request.password())
        );
        user.setIsAdmin(false);
        user.setIsActive(false);

        user = userRepository.save(user);

        String verificationToken =
                UUID.randomUUID().toString();

        EmailVerificationToken token =
                new EmailVerificationToken();

        token.setUser(user);
        token.setToken(verificationToken);
        token.setCreated(Instant.now());
        token.setExpiresAt(
                Instant.now().plus(
                        verificationExpirationHours,
                        ChronoUnit.HOURS
                )
        );

        emailVerificationTokenRepository.save(token);

        mailService.send(
                user.getEmail(),
                "Confirm your Cinema Booking Service account",
                "Welcome " + user.getFirstName()
                        + ",\n\nUse this confirmation token to activate your account: "
                        + verificationToken
                        + "\n\nOr open: http://localhost:8080/api/auth/confirm-email?token="
                        + verificationToken
        );

        return new AuthResponse(
                "Registration successful. Please confirm your email to activate the account.",
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.getIsAdmin(),
                user.getIsActive(),
                null,
                verificationToken,
                null
        );
    }

    public AuthResponse confirmEmail(String tokenValue) {
        EmailVerificationToken token =
                emailVerificationTokenRepository
                        .findByToken(tokenValue)
                        .orElseThrow(
                                () -> new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Confirmation token not found"
                                )
                        );

        if (token.getExpiresAt().isBefore(Instant.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Confirmation token has expired"
            );
        }

        User user = token.getUser();
        user.setIsActive(true);

        userRepository.save(user);
        emailVerificationTokenRepository.delete(token);

        return new AuthResponse(
                "Email confirmed. Account is now active.",
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.getIsAdmin(),
                user.getIsActive(),
                null,
                null,
                null
        );
    }

    public AuthResponse login(LoginRequest request) {
        String identifier =
                request.identifier().trim();

        User user =
                userRepository
                        .findByEmailIgnoreCase(identifier)
                        .or(() ->
                                userRepository
                                        .findByUserNameIgnoreCase(
                                                identifier
                                        )
                        )
                        .orElseThrow(
                                () -> new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Invalid login credentials"
                                )
                        );

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Account is inactive. Please confirm your email."
            );
        }

        if (!passwordEncoder.matches(
                request.password(),
                user.getPassword())) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid login credentials"
            );
        }

        String sessionToken =
                UUID.randomUUID().toString();

        UserSession session =
                new UserSession();

        session.setUser(user);
        session.setToken(sessionToken);
        session.setCreated(Instant.now());
        session.setExpiresAt(
                Instant.now().plus(
                        sessionExpirationHours,
                        ChronoUnit.HOURS
                )
        );
        session.setRevoked(false);

        userSessionRepository.save(session);

        return new AuthResponse(
                "Login successful.",
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.getIsAdmin(),
                user.getIsActive(),
                sessionToken,
                null,
                null
        );
    }

    public AuthResponse forgotPassword(
            ForgotPasswordRequest request) {

        String normalizedEmail =
                request.email().trim().toLowerCase();

        User user =
                userRepository
                        .findByEmailIgnoreCase(normalizedEmail)
                        .orElseThrow(
                                () -> new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "User not found"
                                )
                        );

        String resetTokenValue =
                UUID.randomUUID().toString();

        PasswordResetToken resetToken =
                new PasswordResetToken();

        resetToken.setUser(user);
        resetToken.setToken(resetTokenValue);
        resetToken.setCreated(Instant.now());
        resetToken.setExpiresAt(
                Instant.now().plus(
                        resetExpirationMinutes,
                        ChronoUnit.MINUTES
                )
        );
        resetToken.setUsed(false);

        passwordResetTokenRepository.save(resetToken);

        mailService.send(
                user.getEmail(),
                "Reset your Cinema Booking Service password",
                "Use this password reset token: "
                        + resetTokenValue
                        + "\n\nOr open: http://localhost:5173/reset-password?token="
                        + resetTokenValue
        );

        return new AuthResponse(
                "Password reset instructions sent.",
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.getIsAdmin(),
                user.getIsActive(),
                null,
                null,
                resetTokenValue
        );
    }
    
    @Transactional
    public AuthResponse resetPassword(
            ResetPasswordRequest request) {

        if (!request.newPassword()
                .equals(request.confirmPassword())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Passwords do not match"
            );
        }

        PasswordResetToken resetToken =
                passwordResetTokenRepository
                        .findByToken(request.token())
                        .orElseThrow(
                                () -> new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Reset token not found"
                                )
                        );

        if (Boolean.TRUE.equals(resetToken.getUsed())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Reset token has already been used"
            );
        }

        if (resetToken.getExpiresAt()
                .isBefore(Instant.now())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Reset token has expired"
            );
        }

        User user = resetToken.getUser();

        user.setPassword(
                passwordEncoder.encode(
                        request.newPassword()
                )
        );

        userRepository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        userSessionRepository.deleteByUserUserId(
                user.getUserId()
        );

        return new AuthResponse(
                "Password updated successfully.",
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.getIsAdmin(),
                user.getIsActive(),
                null,
                null,
                null
        );
    }

    public AuthResponse logout(LogoutRequest request) {
        UserSession session =
                userSessionRepository
                        .findByTokenAndRevokedFalse(
                                request.token()
                        )
                        .orElseThrow(
                                () -> new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Session token not found"
                                )
                        );

        if (session.getExpiresAt()
                .isBefore(Instant.now())) {

            session.setRevoked(true);
            userSessionRepository.save(session);

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Session has expired"
            );
        }

        session.setRevoked(true);
        userSessionRepository.save(session);

        User user = session.getUser();

        return new AuthResponse(
                "Logout successful.",
                user.getUserId(),
                user.getUserName(),
                user.getEmail(),
                user.getIsAdmin(),
                user.getIsActive(),
                null,
                null,
                null
        );
    }
}
