package com.csci.cinemabackend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Represents a user's favorite movie.
 */
@Entity
@Table(name = "favoritemovie")
public class FavoriteMovie {

    @EmbeddedId
    private FavoriteMovieId id = new FavoriteMovieId();

    @ManyToOne
    @MapsId("user")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("movie")
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

    public FavoriteMovieId getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Movie getMovie() {
        return movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }
}