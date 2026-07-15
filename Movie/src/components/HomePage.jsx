import React, { useState, useEffect } from 'react';
import './HomePage.css';
import MovieCarousel from './MovieCarousel';
import MovieModal from './MovieModal';
import NavBar from './NavBar';
import FilterModal from './FilterModal';
import LoginModal from './LoginModal';

function HomePage() {
  const [view, setView] = useState('featured');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [comingSoonMovies, setComingSoonMovies] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const [showLogIn, setShowLogIn] = useState(false);

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
        <NavBar onSearch={handleSearch} onFilter={() => setShowFilterModal(true)} onLogIn={() => setShowLogIn(true)}/>
        <p className="text-white p-10">Movie not found</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <NavBar onSearch={handleSearch} onFilter={() => setShowFilterModal(true)} isFiltered={isFiltered}  onBrowseMovies={handleBrowseMovies} onLogIn={() => setShowLogIn(true)}/>

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

        {!isSearching && (
          <section className="movie-list">
            <h2>Now Showing</h2>
            <MovieCarousel movies={carouselMovies} onMovieClick={setSelectedMovie} />
          </section>
        )}
      </main>

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
      {showFilterModal && <FilterModal onClose={() => setShowFilterModal(false)} onApplyFilter={handleFilter} />}
      {showLogIn && <LoginModal onClose={() => setShowLogIn(false)} />}
    </div>
  );
}

export default HomePage;