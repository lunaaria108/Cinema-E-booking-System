package com.csci.cinemabackend.repository;

import com.csci.cinemabackend.model.UserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Integer> {
    Optional<UserSession> findByTokenAndRevokedFalse(String token);

    List<UserSession> findByUserUserid(Integer userId);

    void deleteByUserUserid(Integer userId);
}