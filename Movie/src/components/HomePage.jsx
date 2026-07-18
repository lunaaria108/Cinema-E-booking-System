import React, { useEffect, useState } from "react";
import "./HomePage.css";
import MovieCarousel from "./MovieCarousel";
import MovieModal from "./MovieModal";
import NavBar from "./NavBar";
import FilterModal from "./FilterModal";
import LoginModal from "./LoginModal";
import ResetModal from "./ResetModal";
import AlertModal from "./AlertModal";
import {
  clearAuthState,
  loadAuthState,
} from "../utils/authStorage";

function HomePage() {
  const [auth, setAuth] = useState(() => loadAuthState());

  const [view, setView] = useState("featured");
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);

  const [isLoadingMovies, setIsLoadingMovies] = useState(true);
  const [movieError, setMovieError] = useState("");

  const [isSearching, setIsSearching] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);

  const [showLogIn, setShowLogIn] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");

  const fetchJson = async (url, options = {}) => {
    const response = await fetch(url, options);

    if (!response.ok) {
      const responseText = await response.text();

      throw new Error(
        responseText ||
          `Request failed with status ${response.status}`
      );
    }

    return response.json();
  };

  const loadMovies = async () => {
    try {
      setIsLoadingMovies(true);
      setMovieError("");

      const [currentMovies, comingSoon] = await Promise.all([
        fetchJson("http://localhost:8080/api/movies/current"),
        fetchJson(
          "http://localhost:8080/api/movies/coming-soon"
        ),
      ]);

      setFeaturedMovies(
        Array.isArray(currentMovies) ? currentMovies : []
      );

      setComingSoonMovies(
        Array.isArray(comingSoon) ? comingSoon : []
      );
    } catch (error) {
      console.error("Loading movies failed:", error);
      setMovieError("Unable to load movies.");
      setFeaturedMovies([]);
      setComingSoonMovies([]);
    } finally {
      setIsLoadingMovies(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    if (!auth.userId) {
      setFavoriteMovies([]);
      setLoadingFavorites(false);
      return;
    }

    const loadFavoriteMovies = async () => {
      try {
        setLoadingFavorites(true);

        const data = await fetchJson(
          `http://localhost:8080/api/users/${auth.userId}/favorites`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        const movies = Array.isArray(data)
          ? data
              .map((favorite) => favorite.movie)
              .filter(Boolean)
          : [];

        setFavoriteMovies(movies);
      } catch (error) {
        console.error("Loading favorites failed:", error);
        setFavoriteMovies([]);
      } finally {
        setLoadingFavorites(false);
      }
    };

    loadFavoriteMovies();
  }, [auth.userId, auth.token]);

  const isMovieFavorite = (movieId) => {
    return favoriteMovies.some(
      (movie) => movie.movieId === movieId
    );
  };

  const handleToggleFavorite = async (movie) => {
    if (!auth.userId || !auth.token) {
      setAlertMessage(
        "You must be logged in to favorite a movie."
      );
      return;
    }

    const movieId = movie?.movieId;

    if (!movieId) {
      setAlertMessage("Unable to identify this movie.");
      return;
    }

    const currentlyFavorite = isMovieFavorite(movieId);

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${auth.userId}/favorites/${movieId}`,
        {
          method: currentlyFavorite ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (!response.ok) {
        const responseText = await response.text();

        throw new Error(
          responseText ||
            `Unable to update favorite: ${response.status}`
        );
      }

      if (currentlyFavorite) {
        setFavoriteMovies((currentFavorites) =>
          currentFavorites.filter(
            (favoriteMovie) =>
              favoriteMovie.movieId !== movieId
          )
        );

        return;
      }

      const savedFavorite = await response.json();
      const savedMovie = savedFavorite?.movie;

      if (!savedMovie) {
        throw new Error(
          "The backend did not return the favorited movie."
        );
      }

      setFavoriteMovies((currentFavorites) => {
        const alreadyExists = currentFavorites.some(
          (favoriteMovie) =>
            favoriteMovie.movieId === savedMovie.movieId
        );

        if (alreadyExists) {
          return currentFavorites;
        }

        return [...currentFavorites, savedMovie];
      });
    } catch (error) {
      console.error("Updating favorite failed:", error);
      setAlertMessage(
        error.message || "Unable to update favorite."
      );
    }
  };

  const handleLoginSuccess = (authData) => {
    setAuth(authData || loadAuthState());
    setShowLogIn(false);
  };

  const handleLogout = async () => {
    if (!auth.token) {
      clearAuthState();
      setAuth(loadAuthState());
      return;
    }

    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: auth.token,
        }),
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      clearAuthState();
      setAuth(loadAuthState());
      setFavoriteMovies([]);
    }
  };

  const handleSearch = async (searchTerm) => {
    const trimmedSearchTerm = searchTerm.trim();

    if (!trimmedSearchTerm) {
      setIsSearching(false);
      setIsFiltered(false);
      setView("featured");
      await loadMovies();
      return;
    }

    try {
      setIsLoadingMovies(true);
      setMovieError("");
      setIsSearching(true);

      const data = await fetchJson(
        `http://localhost:8080/api/movies/search?title=${encodeURIComponent(
          trimmedSearchTerm
        )}`
      );

      const movies = Array.isArray(data) ? data : [];

      setFeaturedMovies(movies);
      setComingSoonMovies([]);
    } catch (error) {
      console.error("Movie search failed:", error);
      setMovieError("Unable to search for movies.");
      setFeaturedMovies([]);
      setComingSoonMovies([]);
    } finally {
      setIsLoadingMovies(false);
    }
  };

  const handleFilter = async (genre) => {
    try {
      setIsLoadingMovies(true);
      setMovieError("");

      const data = await fetchJson(
        `http://localhost:8080/api/movies/filter?genre=${encodeURIComponent(
          genre
        )}`
      );

      setFeaturedMovies(Array.isArray(data) ? data : []);
      setComingSoonMovies([]);

      setIsSearching(true);
      setIsFiltered(true);
      setShowFilterModal(false);
    } catch (error) {
      console.error("Filtering movies failed:", error);
      setMovieError("Unable to filter movies.");
      setFeaturedMovies([]);
      setComingSoonMovies([]);
    } finally {
      setIsLoadingMovies(false);
    }
  };

  const handleBrowseMovies = async () => {
    setIsFiltered(false);
    setIsSearching(false);
    setView("featured");
    await loadMovies();
  };

  const displayedMovies =
    view === "comingSoon"
      ? comingSoonMovies
      : featuredMovies;

  const currentHero =
    displayedMovies[0] ||
    featuredMovies[0] ||
    comingSoonMovies[0] ||
    null;

  const carouselMovies = [
    ...featuredMovies,
    ...comingSoonMovies,
  ];

  return (
    <div className="app-container">
      <NavBar
        onSearch={handleSearch}
        onFilter={() => setShowFilterModal(true)}
        isFiltered={isFiltered}
        onBrowseMovies={handleBrowseMovies}
        onLogIn={() => setShowLogIn(true)}
        isLoggedIn={Boolean(auth.token)}
        isAdmin={Boolean(auth.isAdmin)}
        onLogout={handleLogout}
      />

      {isLoadingMovies && (
        <p className="p-10 text-white">Loading movies...</p>
      )}

      {!isLoadingMovies && movieError && (
        <div className="p-10 text-white">
          <p>{movieError}</p>

          <button
            type="button"
            onClick={loadMovies}
            className="mt-4 rounded border border-[#D4AF37] px-4 py-2 text-[#D4AF37]"
          >
            Try Again
          </button>
        </div>
      )}

      {!isLoadingMovies &&
        !movieError &&
        !currentHero && (
          <p className="p-10 text-white">
            No movies matched your search.
          </p>
        )}

      {!isLoadingMovies &&
        !movieError &&
        currentHero && (
          <>
            {!isSearching && (
              <div className="flex items-center justify-end p-4">
                <div className="toggle-bar">
                  <button
                    type="button"
                    onClick={() => setView("featured")}
                    className={
                      view === "featured" ? "active" : ""
                    }
                  >
                    Featured
                  </button>

                  <button
                    type="button"
                    onClick={() => setView("comingSoon")}
                    className={
                      view === "comingSoon" ? "active" : ""
                    }
                  >
                    Coming Soon
                  </button>
                </div>
              </div>
            )}

            <main>
              <section className="hero">
                <div
                  className="featured-card"
                  onClick={() =>
                    setSelectedMovie(currentHero)
                  }
                >
                  {currentHero.trailerImage ? (
                    <img
                      className="hero-poster"
                      src={currentHero.trailerImage}
                      alt={`${currentHero.movieTitle} poster`}
                    />
                  ) : (
                    <div className="poster-placeholder">
                      Poster
                    </div>
                  )}

                  <div className="details">
                    <h2>{currentHero.movieTitle}</h2>
                    <p className="rating">
                      {currentHero.mpaaRating}
                    </p>
                    <p>{currentHero.synopsis}</p>
                  </div>
                </div>
              </section>

              {!isSearching && auth.userId && (
                <section className="movie-list">
                  <h2>Your Favorite Movies</h2>

                  {loadingFavorites ? (
                    <p>Loading favorites...</p>
                  ) : favoriteMovies.length === 0 ? (
                    <p>
                      You haven't favorited any movies yet.
                    </p>
                  ) : (
                    <MovieCarousel
                      movies={favoriteMovies}
                      onMovieClick={setSelectedMovie}
                      onFavorite={handleToggleFavorite}
                      isFavorite={isMovieFavorite}
                    />
                  )}
                </section>
              )}

              {!isSearching && (
                <section className="movie-list">
                  <h2>Now Showing</h2>

                  <MovieCarousel
                    movies={carouselMovies}
                    onMovieClick={setSelectedMovie}
                    onFavorite={handleToggleFavorite}
                    isFavorite={isMovieFavorite}
                  />
                </section>
              )}

              {isSearching &&
                featuredMovies.length > 0 && (
                  <section className="movie-list">
                    <h2>Search Results</h2>

                    <MovieCarousel
                      movies={featuredMovies}
                      onMovieClick={setSelectedMovie}
                      onFavorite={handleToggleFavorite}
                      isFavorite={isMovieFavorite}
                    />
                  </section>
                )}
            </main>
          </>
        )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      {showFilterModal && (
        <FilterModal
          onClose={() => setShowFilterModal(false)}
          onApplyFilter={handleFilter}
        />
      )}

      {showLogIn && (
        <LoginModal
          onClose={() => setShowLogIn(false)}
          onLoginSuccess={handleLoginSuccess}
          onForgotPassword={() => {
            setShowLogIn(false);
            setShowResetModal(true);
          }}
        />
      )}

      {showResetModal && (
        <ResetModal
          onClose={() => setShowResetModal(false)}
        />
      )}

      {alertMessage && (
        <AlertModal
          message={alertMessage}
          onClose={() => setAlertMessage("")}
        />
      )}
    </div>
  );
}

export default HomePage;
