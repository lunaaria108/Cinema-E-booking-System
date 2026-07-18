import './MovieModal.css';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { loadAuthState } from "../utils/authStorage";
import AlertModal from "./AlertModal";

function MovieModal({ movie, onClose }) {
  const navigate = useNavigate();
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const auth = loadAuthState();
  const [alertMessage, setAlertMessage] = useState("");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <div className="modal-top">
          {movie.trailerImage ? (
            <img className="modal-poster" src={movie.trailerImage} alt={`${movie.movieTitle} poster`} />
          ) : (
            <div className="modal-poster placeholder">Poster</div>
          )}
          <div className="modal-details">
            <h2>{movie.movieTitle}</h2>
            <p className="modal-rating">Rating: {movie.mpaaRating}</p>
            <p className="modal-description">{movie.synopsis}</p>
          </div>
        </div>

        <div className="showtimes-section">
          <h3>Show Times</h3>
          <div className="showtimes">
            {movie.showtimes?.map((showtime) => (
              <button key={showtime.showtimeId} onClick={() => setSelectedShowtime(showtime)} className={`showtime-btn ${
                selectedShowtime?.showtimeId === showtime.showtimeId ? 'selected' : ''}`}>
                {showtime.showTime}
              </button>
            ))}
          </div>
        </div>

       <button className="book-btn" onClick={() => {
          if (!auth?.userId) {
              setAlertMessage("You must be signed in to book a movie.");
              return;
          }

          if (!selectedShowtime) {
              setAlertMessage("Please select a showtime before booking.");
              return;
          }

          navigate("/booking", {
              state: {
                  movie,
                  selectedShowtime,
              },
          });
      }}>
        Book Now
      </button>
      </div>

      {alertMessage && (
        <AlertModal
          message={alertMessage}
          onClose={() => setAlertMessage("")}
        />
      )}
    </div>
  );
}

export default MovieModal;