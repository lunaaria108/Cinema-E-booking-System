package com.csci.cinemabackend.model;

import java.io.Serializable;
import java.util.Objects;

/**
 * Composite key for a user's favorite movie.
 */
public class FavoriteMovieId implements Serializable {

    private Integer user;
    private Integer movie;

    public FavoriteMovieId() {
    }

    public FavoriteMovieId(Integer user, Integer movie) {
        this.user = user;
        this.movie = movie;
    }

    public Integer getUser() {
        return user;
    }

    public Integer getMovie() {
        return movie;
    }

    public void setUser(Integer user) {
        this.user = user;
    }

    public void setMovie(Integer movie) {
        this.movie = movie;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) {
            return true;
        }

        if (!(object instanceof FavoriteMovieId)) {
            return false;
        }

        FavoriteMovieId that = (FavoriteMovieId) object;

        return Objects.equals(user, that.user)
                && Objects.equals(movie, that.movie);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, movie);
    }
}
