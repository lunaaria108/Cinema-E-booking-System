import React, { useState, useEffect } from 'react';
import './HomePage.css';
import MovieCarousel from './MovieCarousel';
import MovieModal from './MovieModal';
import NavBar from './NavBar';

function HomePage() {
  const [view, setView] = useState('featured');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/movies/current')
      .then((response) => response.json())
      .then((data) => setFeaturedMovies(data))
      .catch((err) => console.error('Error fetching featured movies:', error));

    fetch('http://localhost:8080/api/movies/coming-soon')
      .then((response) => response.json())
      .then((data) => setComingSoonMovies(data))
      .catch((err) => console.error('Error fetching coming soon movies:', error));
  }, []);

  const currentHero = view === 'featured' ? featuredMovies[0] : comingSoonMovies[0];
  const carouselMovies = [...featuredMovies, ...comingSoonMovies];

  if (!currentHero) {
    return (
      <div className="app-container">
        <NavBar />
        <p className="text-white p-10">Loading movies...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <NavBar />

      <div className="flex justify-end items-center p-4">
        <div className="toggle-bar">
          <button onClick={() => setView('featured')} className={view === 'featured' ? 'active' : ''}>Featured</button>
          <button onClick={() => setView('comingSoon')} className={view === 'comingSoon' ? 'active' : ''}>Coming Soon</button>
        </div>
      </div>

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

        <section className="movie-list">
          <h2>Now Showing</h2>
          <MovieCarousel movies={carouselMovies} onMovieClick={setSelectedMovie} />
        </section>
      </main>

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
    </div>
  );
}

export default HomePage;