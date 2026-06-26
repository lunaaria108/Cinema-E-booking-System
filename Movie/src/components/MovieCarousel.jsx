import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './MovieCarousel.css';

function MovieCarousel({ movies, onMovieClick }) {
  const [index, setIndex] = useState(0);

  const handleNext = () => setIndex((prev) => (prev + 1) % movies.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + movies.length) % movies.length);

  const getPosition = (movieIndex) => {
    const distance = (movieIndex - index + movies.length) % movies.length;
    if (distance === 0) return 'center';
    if (distance === 1) return 'right';
    if (distance === movies.length - 1) return 'left';
    return 'hidden';
  };

  const variants = {
    center: { x: '0%', scale: 1, zIndex: 10, opacity: 1 },
    left: { x: '-120%', scale: 0.8, zIndex: 5, opacity: 0.65 },
    right: { x: '120%', scale: 0.8, zIndex: 5, opacity: 0.65 },
    hidden: { opacity: 0, scale: 0.6, zIndex: 1, pointerEvents: 'none' }
  };

  return (
    <div className="carousel-wrapper">
      <button className="nav-btn" onClick={handlePrev}>◀</button>
      
      <div className="carousel-container">
        {movies.map((movie, movieIndex) => {
          const position = getPosition(movieIndex);
          if (position === 'hidden') return null;

          return (
            <motion.div
              key={`${movie.title}-${movieIndex}`}
              className={`movie-card ${position}`}
              variants={variants}
              initial={false}
              animate={position}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              onClick={() => onMovieClick(movie)}
            >
              <div className="poster-thumb">
                {movie.poster ? (
                  <img src={movie.poster} alt={`${movie.title} poster`} />
                ) : (
                  <div className="poster-placeholder">Poster</div>
                )}
              </div>
              <div className="card-info">
                <h3>{movie.title}</h3>
                <p>{movie.rating} ★</p>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <button className="nav-btn" onClick={handleNext}>▶</button>
    </div>
  );
}

export default MovieCarousel;