import React, { useState } from 'react';
import './App.css';
import MovieCarousel from './components/MovieCarousel';
import MovieModal from './components/MovieModal';

function App() {
  const [view, setView] = useState('featured');
  const [selectedMovie, setSelectedMovie] = useState(null);

  // API-ready structure: these can be swapped for fetched data later.
  const featuredMovies = [
    {
      title: 'Inception',
      rating: 8.8,
      description: 'A mind-bending thriller where dreams become the battlefield.',
      showtimes: ['14:00', '17:00', '20:30'],
      poster: 'https://via.placeholder.com/300x430?text=Inception'
    },
    {
      title: 'The Matrix',
      rating: 8.7,
      description: 'Reality is a simulation and freedom is a choice.',
      showtimes: ['15:30', '19:00', '22:00'],
      poster: 'https://via.placeholder.com/300x430?text=The+Matrix'
    }
  ];

  const comingSoonMovies = [
    {
      title: 'Avatar 3',
      rating: 'N/A',
      description: 'Returning to Pandora for a spectacle beyond imagination.',
      showtimes: ['TBD'],
      poster: 'https://via.placeholder.com/300x430?text=Avatar+3'
    },
    {
      title: 'Dune Part 3',
      rating: 'N/A',
      description: 'The prophecy continues across new deserts and new dangers.',
      showtimes: ['TBD'],
      poster: 'https://via.placeholder.com/300x430?text=Dune+Part+3'
    }
  ];

  const currentHero = view === 'featured' ? featuredMovies[0] : comingSoonMovies[0];
  const carouselMovies = [...featuredMovies, ...comingSoonMovies];

  return (
    <div className="app-container">
      <nav>
        <h1>CINEMA-E</h1>
        <div className="toggle-bar">
          <button onClick={() => setView('featured')} className={view === 'featured' ? 'active' : ''}>Featured</button>
          <button onClick={() => setView('comingSoon')} className={view === 'comingSoon' ? 'active' : ''}>Coming Soon</button>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="featured-card" onClick={() => setSelectedMovie(currentHero)}>
            {currentHero.poster ? (
              <img className="hero-poster" src={currentHero.poster} alt={`${currentHero.title} poster`} />
            ) : (
              <div className="poster-placeholder">Poster</div>
            )}
            <div className="details">
              <h2>{currentHero.title}</h2>
              <p className="rating">{currentHero.rating} ★</p>
              <p>{currentHero.description}</p>
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
export default App;