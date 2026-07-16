package com.csci.cinemabackend.repository;

import com.csci.cinemabackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Provides database operations for users.
 */
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    Optional<User> findByEmailIgnoreCase(String email);

    Optional<User> findByUserName(String userName);

    Optional<User> findByUserNameIgnoreCase(String userName);

    boolean existsByEmail(String email);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByUserName(String userName);

    boolean existsByUserNameIgnoreCase(String userName);
}
