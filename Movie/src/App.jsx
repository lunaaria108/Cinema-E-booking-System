import './App.css';
import React from 'react';
import MovieCarousel from './components/MovieCarousel'; 
function App() {
  const myMovies = [
    "Inception",
    "The Dark Knight",
    "Interstellar",
    "The Matrix",
    "Pulp Fiction",
    "The Shawshank Redemption",
    "The Godfather",
    "Fight Club",
    "Forrest Gump",
    "The Lord of the Rings: The Return of the King"
  ];

  return (
    <div className="app-container">
      {/* Navigation */}
      <nav>
        <h1>CinemaE</h1>
        <ul>
          <li>Movies</li>
          <li>My Bookings</li>
        </ul>
      </nav>

      <main>
        <section className="hero">
          <h2>Featured Movie</h2>
          <div className="placeholder-hero">Movie Poster/Trailer</div>
        </section>

        <section className="movie-list">
          <h2>All Movies</h2>
          <MovieCarousel movies={myMovies} />
        </section>
      </main>

      <footer>
        <p>&copy; 2026 Cinema E-Booking</p>
      </footer>
    </div>
  );
}

export default App;