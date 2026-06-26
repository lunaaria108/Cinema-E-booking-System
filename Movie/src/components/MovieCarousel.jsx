import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './MovieCarousel.css';

function MovieCarousel({ movies }) {
  const [index, setIndex] = useState(0);

  const handleNext = () => setIndex((prev) => (prev + 1) % movies.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + movies.length) % movies.length);

  const variants = {
    center: { x: 0, scale: 1, zIndex: 2, opacity: 1 },
    left: { x: -300, scale: 0.7, zIndex: 1, opacity: 0.5 },
    right: { x: 300, scale: 0.7, zIndex: 1, opacity: 0.5 }
  };

  return (
    <div className="carousel-wrapper">
      <button className="nav-btn" onClick={handlePrev}>◀</button>
      
      <div className="carousel-container">
        {[ (index - 1 + movies.length) % movies.length, index, (index + 1) % movies.length ].map((movieIndex, i) => (
          <motion.div
            key={movies[movieIndex]}
            className="movie-card"
            variants={variants}
            initial="left"
            animate={i === 1 ? "center" : i === 0 ? "left" : "right"}
            transition={{ duration: 0.5 }}
          >
            <h3>{movies[movieIndex]}</h3>
          </motion.div>
        ))}
      </div>
      
      <button className="nav-btn" onClick={handleNext}>▶</button>
    </div>
  );
}

export default MovieCarousel;