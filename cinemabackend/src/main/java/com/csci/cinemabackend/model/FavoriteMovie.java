package com.csci.cinemabackend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a user's favorite movie.
 */
@Entity
@Table(name = "favoritemovie")
@IdClass(FavoriteMovieId.class)
public class FavoriteMovie {

    @Id
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Id
    @ManyToOne
    @JoinColumn(name = "movie_id")
    private Movie movie;

    @Column(name = "added_at", nullable = false)
    private LocalDateTime addedAt;

    public FavoriteMovie() {
    }

    @PrePersist
    protected void onCreate() {
        if (addedAt == null) {
            addedAt = LocalDateTime.now();
        }
    }

    public User getUser() {
        return user;
    }

    public Movie getMovie() {
        return movie;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }
}
