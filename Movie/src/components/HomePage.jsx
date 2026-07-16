import React, { useState, useEffect } from 'react';
import './HomePage.css';
import MovieCarousel from './MovieCarousel';
import MovieModal from './MovieModal';
import NavBar from './NavBar';
import FilterModal from './FilterModal';
import LoginModal from './LoginModal';
import ResetModal from './ResetModal';
import { clearAuthState, loadAuthState } from "../utils/authStorage";

function HomePage() {
  const [auth, setAuth] = useState(() => loadAuthState());
  const [view, setView] = useState('featured');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [showLogIn, setShowLogIn] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  useEffect(() => {
    if (!auth.userId) {
      setFavoriteMovies([]);
      setLoadingFavorites(false);
      return;
    }

    const loadFavoriteMovies = async () => {
      try {
        setLoadingFavorites(true);

        const response = await fetch(
          `http://localhost:8080/api/users/${auth.userId}/favorites`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Unable to load favorites: ${response.status}`
          );
        }

        const data = await response.json();

        const movies = data
          .map((favorite) => favorite.movie)
          .filter(Boolean);

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
    if (!auth.userId) {
      alert("You must be logged in to favorite a movie.");
      return;
    }

    const movieId = movie.movieId;

    if (!movieId) {
      console.error("Movie is missing movieId:", movie);
      alert("Unable to identify this movie.");
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
      const savedMovie = savedFavorite.movie;

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
      alert(error.message);
    }
  };

  const handleLoginSuccess = (authData) => {
    setAuth(loadAuthState());

    if (authData.isAdmin) {
        navigate("/admin");
    }
  };

  const handleLogout = async () => {
    if (!auth.token) {
      clearAuthState();
      setAuth(loadAuthState());
      return;
    }

    try {
      await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: auth.token }),
      });
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      clearAuthState();
      setAuth(loadAuthState());
    }
  };

  const handleSearch = (searchTerm) => {
    if (searchTerm.trim() === '') {
      setIsSearching(false);

      fetch('http://localhost:8080/api/movies/current')
        .then((response) => response.json())
        .then((data) => setFeaturedMovies(data));

      fetch("http://localhost:8080/api/movies/coming-soon")
        .then((response) => response.json())
        .then((data) => setComingSoonMovies(data));
      
        return;  
    }

    setIsSearching(true);

    fetch(`http://localhost:8080/api/movies/search?title=${encodeURIComponent(searchTerm)}`)
      .then((response) => response.json())
      .then((data) => {
        setFeaturedMovies(data);
        setComingSoonMovies(data);
      })
      .catch((error) => console.error('Error fetching search results:', error));
  };

  const handleFilter = (genre) => {
    fetch(`http://localhost:8080/api/movies/filter?genre=${encodeURIComponent(genre)}`)
      .then((response) => response.json())
      .then((data) => {
        setFeaturedMovies(data);
        setComingSoonMovies([]);
        setIsSearching(true);
        setShowFilterModal(false);
        setIsFiltered(true);
      })
      .catch((error) => console.error("Error filtering movies:", error));
      
  };

  const handleBrowseMovies = () => {
    setIsFiltered(false);
    setIsSearching(false);

    fetch("http://localhost:8080/api/movies/current")
        .then(res => res.json())
        .then(data => setFeaturedMovies(data));

    fetch("http://localhost:8080/api/movies/coming-soon")
        .then(res => res.json())
        .then(data => setComingSoonMovies(data));
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/movies/current')
      .then((response) => response.json())
      .then((data) => setFeaturedMovies(data))
      .catch((error) => console.error('Error fetching featured movies:', error)); 

    fetch('http://localhost:8080/api/movies/coming-soon')
      .then((response) => response.json())
      .then((data) => setComingSoonMovies(data))
      .catch((error) => console.error('Error fetching coming soon movies:', error));
  }, []);

  const currentHero = view === 'featured' ? featuredMovies[0] : comingSoonMovies[0];
  const carouselMovies = [...featuredMovies, ...comingSoonMovies];

  if (!currentHero) {
    return (
      <div className="app-container">
        <NavBar onSearch={handleSearch} onFilter={() => setShowFilterModal(true)} onLogIn={() => setShowLogIn(true)} isLoggedIn={Boolean(auth.token)} onLogout={handleLogout}/>
        <p className="text-white p-10">Movie not found</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <NavBar onSearch={handleSearch} onFilter={() => setShowFilterModal(true)} isFiltered={isFiltered}  onBrowseMovies={handleBrowseMovies} onLogIn={() => setShowLogIn(true)} isLoggedIn={Boolean(auth.token)} onLogout={handleLogout}/>
  {showLogIn && (<LoginModal onClose={() => setShowLogIn(false)} onForgotPassword={() => {setShowLogIn(false), setShowResetModal(true)}} onLoginSuccess={handleLoginSuccess}/>) }

    {!isSearching && (
      <div className="flex justify-end items-center p-4">
        <div className="toggle-bar">
          <button onClick={() => setView('featured')} className={view === 'featured' ? 'active' : ''}>Featured</button>
          <button onClick={() => setView('comingSoon')} className={view === 'comingSoon' ? 'active' : ''}>Coming Soon</button>
        </div>
      </div>
    )}

      <main>
        <section className="hero">
          <div className="featured-card" onClick={() => setSelectedMovie(currentHero)}>
            {currentHero.trailerImage ? (
              <img className="hero-poster" src={currentHero.trailerImage} alt={`${currentHero.movieTitle} poster`} />
            ) : (
              <div className="poster-placeholder">Poster</div>
            )}
            <div className="details">
              <h2>{currentHero.movieTitle}</h2>
              <p className="rating">{currentHero.mpaaRating}</p>
              <p>{currentHero.synopsis}</p>
            </div>
          </div>
        </section>

         {/* FAVORITES */}
          {!isSearching && auth.userId && (
            <section className="movie-list">
              <h2>Your Favorite Movies</h2>

              {loadingFavorites ? (
                <p>Loading favorites...</p>
              ) : favoriteMovies.length === 0 ? (
                <p>You haven't favorited any movies yet.</p>
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
            <MovieCarousel movies={carouselMovies} onMovieClick={setSelectedMovie} onFavorite={handleToggleFavorite} isFavorite={isMovieFavorite} />
          </section>
        )}
      </main>

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
      {showFilterModal && <FilterModal onClose={() => setShowFilterModal(false)} onApplyFilter={handleFilter} />}
      {showLogIn && (<LoginModal onClose={() => setShowLogIn(false)} onForgotPassword={() => {setShowLogIn(false), setShowResetModal(true)}}/>)}
      {showResetModal && (<ResetModal onClose={() => setShowResetModal(false)} />)}
    </div>
  );
}

export default HomePage;